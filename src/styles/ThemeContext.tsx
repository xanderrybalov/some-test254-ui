import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ConfigProvider, theme } from 'antd';
import type { ThemeMode, Theme } from '../types/theme';
import { lightTheme, darkTheme } from './themes';

interface ThemeContextType {
  themeMode: ThemeMode;
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  
  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;
  
  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const antdTheme = {
    algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: currentTheme.colors.primary,
      borderRadius: parseInt(currentTheme.borderRadius),
      colorBgContainer: currentTheme.colors.surface,
      colorBgBase: currentTheme.colors.background,
      colorText: currentTheme.colors.text,
      colorTextSecondary: currentTheme.colors.textSecondary,
      colorBorder: currentTheme.colors.border,
    },
  };

  return (
    <ThemeContext.Provider value={{ themeMode, theme: currentTheme, toggleTheme }}>
      <StyledThemeProvider theme={currentTheme}>
        <ConfigProvider theme={antdTheme}>
          {children}
        </ConfigProvider>
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
