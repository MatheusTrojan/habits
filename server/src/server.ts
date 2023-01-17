import Fastify from "fastify";
import { PrismaClient } from "@prisma/client"; 

const app = Fastify();
const prisma = new PrismaClient();

app.get("/hello", async () => {

    const habits = await prisma.habit.findMany({

    })

    return habits
})

app.listen({
    port: 3333,
}).then(() => {
    console.log("HTTP Server running")
})