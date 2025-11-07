import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FoodHomeScreen from '../screens/FoodHomeScreen';
import FoodListScreen from '../screens/FoodListScreen';
import VenueDetailScreen from '../screens/VenueDetailScreen';
import { Colors } from '../constants/Colors';

export type FoodStackParamList = {
  Geri: undefined;
  FoodList: { categoryId: number; categoryName: string };
  VenueDetail: { venueId: number };
};

const Stack = createNativeStackNavigator<FoodStackParamList>();

export default function FoodStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Geri"
        component={FoodHomeScreen}
      />
      <Stack.Screen
        name="FoodList"
        component={FoodListScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.surface,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
          title: '',
        }}
      />
      <Stack.Screen
        name="VenueDetail"
        component={VenueDetailScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.surface,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
          title: '',
        }}
      />
    </Stack.Navigator>
  );
}
