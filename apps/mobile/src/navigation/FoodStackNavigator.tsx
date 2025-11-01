import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { FoodStackParamList } from "../types/navigation";
import FoodHomeScreen from "../screens/FoodHomeScreen";

const Stack = createNativeStackNavigator<FoodStackParamList>();

export default function FoodStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2563eb",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="FoodHome"
        component={FoodHomeScreen}
        options={{ title: "Yeme-İçme" }}
      />
    </Stack.Navigator>
  );
}
