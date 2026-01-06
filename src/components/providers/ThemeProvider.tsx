import { ThemeProvider as BudtrThemeProvider } from '@mui/material/styles';
import React, { createContext, useContext, useState, ReactNode } from 'react';

import budtrTheme, { budtrDarkTheme } from '@/configs/theme';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentTheme = isDarkMode ? budtrDarkTheme : budtrTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <BudtrThemeProvider theme={currentTheme}>{children}</BudtrThemeProvider>
    </ThemeContext.Provider>
  );
};
