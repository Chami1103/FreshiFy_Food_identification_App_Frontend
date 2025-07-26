import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeDashboardScreen from '../screens/HomeDashboardScreen';
import DetectionScreen from '../screens/DetectionScreen';
import StorageScreen from '../screens/StorageScreen';
import RecipesScreen from '../screens/RecipesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import FamilyScreen from '../screens/FamilyScreen';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0.5 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-analytics" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Detect"
        component={DetectionScreen}
        options={{
          tabBarLabel: 'Detect',
          tabBarIcon: ({ color, size }) => (
            <Feather name="camera" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Storage"
        component={StorageScreen}
        options={{
          tabBarLabel: 'Storage',
          tabBarIcon: ({ color, size }) => (
            <Feather name="box" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Recipes"
        component={RecipesScreen}
        options={{
          tabBarLabel: 'Recipes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chef-hat" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Family"
        component={FamilyScreen}
        options={{
          tabBarLabel: 'Family',
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
