export interface ThemeColors {
  primary: string;
  primaryHover: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

export interface Theme {
  colors: ThemeColors;
  borderRadius: string;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export type ThemeMode = 'light' | 'dark';
