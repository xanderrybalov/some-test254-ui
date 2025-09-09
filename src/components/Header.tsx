import React from 'react';
import { Layout, Typography, Switch, Space, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { SunOutlined, MoonOutlined, VideoCameraOutlined, UserOutlined, LogoutOutlined, LoginOutlined, StarOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../styles/ThemeContext';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/authSlice';
import { toggleShowFavoritesOnly, fetchFavorites, clearFavorites } from '../store/favoritesSlice';

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

const FavoritesButton = styled(Button)<{ $isActive: boolean }>`
  border: none;
  background: ${props => props.$isActive ? 'rgba(251, 191, 36, 0.15)' : 'transparent'};
  color: ${props => props.$isActive ? '#f59e0b' : '#fbbf24'};
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: ${props => props.$isActive ? '600' : '500'};
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover, &:focus {
    color: #f59e0b;
    background: rgba(251, 191, 36, 0.15);
    transform: ${props => props.$isActive ? 'none' : 'translateY(-1px)'};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  .anticon {
    font-size: 16px;
    margin-right: 6px;
  }
`;

export const Header: React.FC = () => {
  const { themeMode, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { showFavoritesOnly } = useAppSelector((state) => state.favorites);


  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearFavorites());
    navigate('/');
  };

  const handleToggleFavorites = () => {
    dispatch(toggleShowFavoritesOnly());
    
    // Always fetch fresh favorites data when switching to favorites view
    if (!showFavoritesOnly && user?.id) {
      dispatch(fetchFavorites(user.id));
    }
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
          <Title level={3}>Rybalov Movie Finder</Title>
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

        {/* Favorites Button - Only for authenticated users */}
        {isAuthenticated && (
          <FavoritesButton 
            type="text"
            icon={<StarOutlined />}
            title={showFavoritesOnly ? "Show All Movies" : "Show Favorites Only"}
            onClick={handleToggleFavorites}
            $isActive={showFavoritesOnly}
          >
            {showFavoritesOnly ? "All Movies" : "Favorites"}
          </FavoritesButton>
        )}

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
