import { ActivityIndicator, View } from "react-native";

export function Loading() {
    return (
        <View style={{ 
            alignItems: "center",
            backgroundColor: "#09090A" ,
            justifyContent: "center", 
            flex: 1 
        }}>
            <ActivityIndicator color="#7C3AED" />
        </View>
    )
}