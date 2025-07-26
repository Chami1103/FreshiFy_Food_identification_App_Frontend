// AppThemeProvider.tsx
import React, { createContext, useState, useContext, useMemo } from 'react';

export const ThemeContext = createContext();

const lightTheme = {
  bg: '#f8fafc',
  card: '#fff',
  bgSoft: '#f1f5f9',
  text: '#222',
  subtext: '#64748b',
  icon: '#2563eb',
};
const darkTheme = {
  bg: '#18181b',
  card: '#23232a',
  bgSoft: '#31313a',
  text: '#f3f4f6',
  subtext: '#cbd5e1',
  icon: '#38bdf8',
};

export function AppThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  const theme = useMemo(() => (dark ? darkTheme : lightTheme), [dark]);

  return (
    <ThemeContext.Provider value={{ dark, setDark, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for usage: 
export function useTheme() {
  return useContext(ThemeContext);
}
