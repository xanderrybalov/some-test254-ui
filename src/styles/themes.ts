import type { Theme } from '../types/theme';

export const lightTheme: Theme = {
  colors: {
    primary: '#9E339F',
    primaryHover: '#8A2E8B',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#d9d9d9',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  borderRadius: '2px',
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px'
  }
};

export const darkTheme: Theme = {
  colors: {
    primary: '#9E339F',
    primaryHover: '#B13EB4',
    background: '#1f1f1f',
    surface: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#a8a8a8',
    border: '#434343',
    shadow: 'rgba(255, 255, 255, 0.1)'
  },
  borderRadius: '2px',
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px'
  }
};
