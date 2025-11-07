import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DealsScreen from '../screens/DealsScreen';
import DealDetailScreen from '../screens/DealDetailScreen';
import { Colors } from '../constants/Colors';

export type DealsStackParamList = {
  Geri: undefined;
  DealDetail: { dealId: number };
};

const Stack = createNativeStackNavigator<DealsStackParamList>();

export default function DealsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Geri"
        component={DealsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DealDetail"
        component={DealDetailScreen}
        options={{ title: 'Kampanya Detayı' }}
      />
    </Stack.Navigator>
  );
}
