import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import EventDetailScreen from '../screens/EventDetailScreen';
import EventsScreen from '../screens/EventsScreen';

export type EventsStackParamList = {
  Geri: undefined;
  EventDetail: { eventId: number };
};

const Stack = createNativeStackNavigator<EventsStackParamList>();

export default function EventsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Geri"
        component={EventsScreen}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
