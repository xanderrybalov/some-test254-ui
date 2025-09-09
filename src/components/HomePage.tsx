import React from 'react';
import { Layout, Typography } from 'antd';
import styled from 'styled-components';
import { Header } from './Header';
import { MovieSearch } from './MovieSearch';
import { MovieList } from './MovieList';
import { useAppSelector } from '../hooks/redux';

const { Content } = Layout;
const { Title, Text } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const StyledContent = styled(Content)`
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const WelcomeSection = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  .ant-typography {
    color: ${({ theme }) => theme.colors.text} !important;
  }
  
  h1 {
    margin-bottom: ${({ theme }) => theme.spacing.sm} !important;
  }
`;

export const HomePage: React.FC = () => {
  const { showFavoritesOnly } = useAppSelector((state) => state.favorites);

  return (
    <StyledLayout>
      <Header />
      <StyledContent>
        <WelcomeSection>
          <Title level={1}>
            {showFavoritesOnly ? 'Your Favorite Movies' : 'Discover Amazing Movies'}
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            {showFavoritesOnly 
              ? 'Here are all the movies you\'ve added to your favorites'
              : 'Search through thousands of movies and find your next favorite film'
            }
          </Text>
        </WelcomeSection>
        
        {/* Show search only when not in favorites mode */}
        {!showFavoritesOnly && <MovieSearch />}
        <MovieList />
      </StyledContent>
    </StyledLayout>
  );
};
