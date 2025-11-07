import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LifeScreen from '../screens/LifeScreen';
import PharmaciesScreen from '../screens/PharmaciesScreen';
import BarbersScreen from '../screens/BarbersScreen';
import BusScheduleScreen from '../screens/BusScheduleScreen';
import HairdresserScreen from '../screens/HairdresserScreen';
import { Colors } from '../constants/Colors';

export type LifeStackParamList = {
  Geri: undefined;
  Pharmacies: undefined;
  Barbers: undefined;
  BusSchedule: undefined;
  Hairdresser: undefined;
};

const Stack = createNativeStackNavigator<LifeStackParamList>();

export default function LifeStackNavigator() {
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
        component={LifeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pharmacies"
        component={PharmaciesScreen}
        options={{
          title: 'Eczaneler',
          headerTitleAlign: 'left',
        }}
      />
      <Stack.Screen
        name="Barbers"
        component={BarbersScreen}
        options={{ title: 'Berber' }}
      />
      <Stack.Screen
        name="BusSchedule"
        component={BusScheduleScreen}
        options={{
          title: 'Otobüs Saatleri',
          headerTitleAlign: 'left',
        }}
      />
      <Stack.Screen
        name="Hairdresser"
        component={HairdresserScreen}
        options={{ title: 'Kuaför' }}
      />
    </Stack.Navigator>
  );
}
