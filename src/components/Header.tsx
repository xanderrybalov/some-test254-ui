import React from 'react';
import { Layout, Typography, Switch, Space, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { SunOutlined, MoonOutlined, VideoCameraOutlined, UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../styles/ThemeContext';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/authSlice';

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

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
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

const AuthControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UserButton = styled(Button)`
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  
  &:hover, &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LoginButton = styled(Button)`
  border-radius: 8px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #ff6b6b);
  border: none;
  
  &:hover, &:focus {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryHover}, #ff5252);
    transform: translateY(-1px);
  }
`;

export const Header: React.FC = () => {
  const { themeMode, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: `Welcome, ${user?.username}!`,
      icon: <UserOutlined />,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <StyledHeader>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Logo>
          <VideoCameraOutlined />
          <Title level={3}>Movie Finder</Title>
        </Logo>
      </Link>
      
      <HeaderControls>
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

        <AuthControls>
          {isAuthenticated ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <UserButton icon={<UserOutlined />}>
                {user?.username}
              </UserButton>
            </Dropdown>
          ) : (
            <Space>
              <LoginButton 
                type="primary"
                
                icon={<UserOutlined />}
                onClick={() => navigate('/register')}
              >
                Sign Up
              </LoginButton>
              <LoginButton 
                type="primary"
                icon={<LoginOutlined />}
                onClick={() => navigate('/login')}
              >
                Login
              </LoginButton>
            </Space>
          )}
        </AuthControls>
      </HeaderControls>
    </StyledHeader>
  );
};
