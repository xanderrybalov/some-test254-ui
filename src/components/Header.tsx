import React from 'react';
import { Layout, Typography, Switch, Space } from 'antd';
import { SunOutlined, MoonOutlined, VideoCameraOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTheme } from '../styles/ThemeContext';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const StyledHeader = styled(AntHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.surface} !important;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.shadow};
  
  .ant-typography {
    color: ${({ theme }) => theme.colors.text} !important;
    margin: 0;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  .anticon {
    font-size: 24px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ThemeControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  .theme-switch {
    .ant-switch-checked {
      background-color: ${({ theme }) => theme.colors.primary} !important;
    }
  }
  
  .anticon {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 16px;
  }
`;

export const Header: React.FC = () => {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <StyledHeader>
      <Logo>
        <VideoCameraOutlined />
        <Title level={3}>Movie Finder</Title>
      </Logo>
      
      <ThemeControls>
        <Space align="center">
          <SunOutlined />
          <Switch
            className="theme-switch"
            checked={themeMode === 'dark'}
            onChange={toggleTheme}
            size="default"
          />
          <MoonOutlined />
        </Space>
      </ThemeControls>
    </StyledHeader>
  );
};
