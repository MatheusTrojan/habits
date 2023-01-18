import { TouchableOpacity, Dimensions } from "react-native";

const WEEK_DAYS = 7;
const SCREEN_HORINZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
export const SQUARE_SIZE = (Dimensions.get("screen").width / WEEK_DAYS) - (SCREEN_HORINZONTAL_PADDING + 5);

export function HabitDay() {
  return (
    <TouchableOpacity 
        className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800"
        style={{ width: SQUARE_SIZE, height: SQUARE_SIZE}}
    />
  )
}
