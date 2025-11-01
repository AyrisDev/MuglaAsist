import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import type { RootTabParamList } from "../types/navigation";
import FoodStackNavigator from "./FoodStackNavigator";
import TransportScreen from "../screens/TransportScreen";
import CampusScreen from "../screens/CampusScreen";

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Food") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "Transport") {
            iconName = focused ? "bus" : "bus-outline";
          } else {
            iconName = focused ? "school" : "school-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Food"
        component={FoodStackNavigator}
        options={{ title: "Yeme-İçme" }}
      />
      <Tab.Screen
        name="Transport"
        component={TransportScreen}
        options={{ title: "Ulaşım" }}
      />
      <Tab.Screen
        name="Campus"
        component={CampusScreen}
        options={{ title: "Kampüs" }}
      />
    </Tab.Navigator>
  );
}
