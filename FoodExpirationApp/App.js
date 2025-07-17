import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SensorScreen from './screens/SensorScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Freshify AI" component={HomeScreen} />
        <Stack.Screen name="Sensor Monitor" component={SensorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
