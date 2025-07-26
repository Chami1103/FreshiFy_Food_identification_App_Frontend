import React, { useState, createContext } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// FIXED import
import BottomTabNavigator from '../navigation/BottomTabNavigator';



export const ThemeContext = createContext();
export const AuthContext = createContext();

export default function MainApp() {
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);

  const login = (name, email) => setUser({ name, email });
  const signup = (name, email) => setUser({ name, email });
  const logout = () => setUser(null);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <AuthContext.Provider value={{ user, login, signup, logout }}>
        <NavigationContainer>
          <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
          <BottomTabNavigator />
        </NavigationContainer>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
