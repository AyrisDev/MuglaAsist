import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/lib/queryClient";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
