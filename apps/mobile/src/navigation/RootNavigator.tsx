import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FoodStackNavigator from './FoodStackNavigator';
import LifeStackNavigator from './LifeStackNavigator';
import EventsStackNavigator from './EventsStackNavigator';
import DealsStackNavigator from './DealsStackNavigator';
import { Colors } from '../constants/Colors';

export type RootTabParamList = {
  Food: undefined;
  Life: undefined;
  Events: undefined;
  Deals: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Food') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Life') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Events') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Deals') {
            iconName = focused ? 'pricetags' : 'pricetags-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
        }, 
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Food"
        component={FoodStackNavigator}
        options={{ title: 'İşletmeler' }}
      />
            <Tab.Screen
        name="Events"
        component={EventsStackNavigator}
        options={{ title: 'Etkinlikler' }}
      />
      <Tab.Screen
        name="Life"
        component={LifeStackNavigator}
        options={{ title: 'Yaşam' }}
      />
            <Tab.Screen
        name="Deals"
        component={DealsStackNavigator}
        options={{ title: 'Kampanyalar' }}
      />

    </Tab.Navigator>
  );
}
