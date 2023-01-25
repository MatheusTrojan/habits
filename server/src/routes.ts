import dayjs from "dayjs"
import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "./lib/prisma"

export async function appRoutes(app: FastifyInstance) {

    app.post("/habits", async (request) => {

        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(6)
            )
        })

        const { title, weekDays } = createHabitBody.parse(request.body)

        const today = dayjs().startOf("day").toDate()

        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay
                        }
                    })
                }
            }
        })
    })

    app.get("/day", async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date() //coerce converte o parametro date que vem como string do front em uma data valida
        })

        const { date } = getDayParams.parse(request.query)

        const parsedDate = dayjs(date).startOf("day")
        const weekDay = parsedDate.get("day")

        // quero carregar todos habitos do dia e todos os habitos ja completados

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date
                },
                weekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate(),
            },
            include: {
                dayHabits: true
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        }) ?? []

        return {
            possibleHabits,
            completedHabits
        }
    })

    app.patch("/habits/:id/toggle", async (request) => {

        const toggleHabitParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = toggleHabitParams.parse(request.params)

        const today = dayjs().startOf("day").toDate()


        let day = await prisma.day.findUnique({
            where: {
                date: today,                
            }
        })

        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today,
                }
            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id,
                }
            }
        })

        // se já estava marcado como completo (regitro ja existe no banco de dados)
        if (dayHabit) {
        // remover a marcação de completo
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        } else {
        // Completa o hábito no dia
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            })
        }


    })

    app.get("/summary", async () => {
        // retornar um resumo, onde tenha uma lista com várias informações dentro (cada informação sendo um objeto)
        // [ { date: 19/01, amountOfHabits: 5, amountOfCompletedHabits: 5 }, { date: 20/01, amountOfHabits: 3, amountOfCompletedHabits: 1 }, etc ]

        const summary = await prisma.$queryRaw`
            SELECT 
                D.id, 
                D.date,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM day_habits as DH
                    WHERE DH.day_id = D.id
                ) as completed,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM habit_week_days as HWD
                    JOIN habits as H
                        ON H.id = HWD.habit_id
                    WHERE 
                        HWD.week_day = cast(strftime("%w", D.date/1000.0, "unixepoch") as int)
                        AND H.created_at <= D.date
                ) as amount
            
            FROM day as D
        `

        return summary
    })

}