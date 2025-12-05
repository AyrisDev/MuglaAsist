import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import { Colors } from '../constants/Colors';
import DashboardScreen from '../screens/DashboardScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DealsStackNavigator from './DealsStackNavigator';
import EventsStackNavigator from './EventsStackNavigator';
import FoodStackNavigator from './FoodStackNavigator';
import LifeStackNavigator from './LifeStackNavigator';

export type RootTabParamList = {
  Dashboard: undefined;
  Venue: undefined;
  Campaign: undefined;
  LifeStyle: undefined;
  Map: undefined;
  Updates: undefined;
  Profile: undefined;
  Events: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Venue') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Campaign') {
            iconName = focused ? 'pricetag' : 'pricetag-outline';
          } else if (route.name === 'LifeStyle') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          // Custom active state styling (orange background)
          if (focused) {
            return (
              <View style={{
                backgroundColor: Colors.primary,
                padding: 10,
                borderRadius: 12,
              }}>
                <Ionicons name={iconName} size={24} color="#fff" />
              </View>
            );
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',

        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#33261F',
          borderRadius: 30,
          height: 90,
          borderTopWidth: 0,
          paddingBottom: 10,
          paddingTop: 10,
          paddingHorizontal: 15,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
            },
            android: {
              elevation: 5,
            },
          }),
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 5,
        },
        headerShown: false,
      })}
    >
      {/* Visible Tabs */}
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: t('navigation.dashboard') }}
      />
      <Tab.Screen
        name="Venue"
        component={FoodStackNavigator}
        options={{ title: t('navigation.food') }}
      />
      <Tab.Screen
        name="Campaign"
        component={DealsStackNavigator}
        options={{ title: t('navigation.deals') }}
      />
      <Tab.Screen
        name="LifeStyle"
        component={LifeStackNavigator}
        options={{ title: t('navigation.life') }}
      />

      {/* Hidden Tabs (Accessible via Navigation) */}
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: t('navigation.map'),
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Updates"
        component={DealsStackNavigator}
        options={{
          title: t('navigation.deals'),
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t('navigation.profile'),
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsStackNavigator}
        options={{
          title: t('navigation.events'),
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator >
  );
}
