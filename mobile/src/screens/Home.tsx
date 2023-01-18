import { View, Text } from "react-native";

import { HabitDay, SQUARE_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";

const weekDay = ["D", "S", "T", "Q", "Q", "S", "S"];

export function Home() {
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header />

            <View className="flex-row mt-6 mb-2">
                {
                    weekDay.map((weekDay, i) => (
                        <Text 
                            key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{ width: SQUARE_SIZE }}
                        >
                            {weekDay}
                        </Text>
                    ))
                }
            </View>

            <HabitDay />
        </View>
    )
}