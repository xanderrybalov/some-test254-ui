import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  #root {
    width: 100%;
    min-height: 100vh;
  }

  .ant-layout {
    background: ${({ theme }) => theme.colors.background} !important;
  }

  .ant-card {
    background: ${({ theme }) => theme.colors.surface} !important;
    border-color: ${({ theme }) => theme.colors.border} !important;
  }

  .ant-input, .ant-input-search {
    background: ${({ theme }) => theme.colors.surface} !important;
    border-color: ${({ theme }) => theme.colors.border} !important;
    color: ${({ theme }) => theme.colors.text} !important;
    
    &:hover, &:focus {
      border-color: ${({ theme }) => theme.colors.primary} !important;
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20 !important;
    }
  }

  .ant-btn-primary {
    background-color: ${({ theme }) => theme.colors.primary} !important;
    border-color: ${({ theme }) => theme.colors.primary} !important;
    
    &:hover, &:focus {
      background-color: ${({ theme }) => theme.colors.primaryHover} !important;
      border-color: ${({ theme }) => theme.colors.primaryHover} !important;
    }
  }

  .ant-empty-description {
    color: ${({ theme }) => theme.colors.textSecondary} !important;
  }

  .ant-spin-text {
    color: ${({ theme }) => theme.colors.text} !important;
  }

  .ant-alert {
    background: ${({ theme }) => theme.colors.surface} !important;
    border-color: ${({ theme }) => theme.colors.border} !important;
  }

  .ant-typography {
    color: ${({ theme }) => theme.colors.text} !important;
  }

  .ant-typography.ant-typography-secondary {
    color: ${({ theme }) => theme.colors.textSecondary} !important;
  }
`;
