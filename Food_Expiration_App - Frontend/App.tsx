import React from 'react';
import { AppThemeProvider } from './components/AppThemeProvider';
import MainApp from './main/MainApp';


export default function App() {
  return (
    <AppThemeProvider>
      <MainApp />
    </AppThemeProvider>
  );
}
