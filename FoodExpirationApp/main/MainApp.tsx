import React, { useState, createContext } from 'react';
import { StatusBar } from 'react-native';
import UserProfile from './screens/UserProfile';
import BottomTabNavigator from '../navigation/BottomTabNavigator';



export const ThemeContext = createContext();
export const AuthContext = createContext();

export default function MainApp() {
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);

  // Simple auth methods
  const login = (name, email) => setUser({ name, email });
  const signup = (name, email) => setUser({ name, email });
  const logout = () => setUser(null);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <AuthContext.Provider value={{ user, login, signup, logout }}>
        <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
        {/* Replace below with proper NavigationContainer if needed */}
        <BottomTabNavigator />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
