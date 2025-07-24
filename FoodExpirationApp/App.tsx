import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppThemeProvider } from './components/AppThemeProvider';
import MainApp from './main/MainApp';

export default function App() {
  return (
    <AppThemeProvider>
      <NavigationContainer>
        <MainApp />
      </NavigationContainer>
    </AppThemeProvider>
  );
}
