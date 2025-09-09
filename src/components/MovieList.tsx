import React from 'react';
import { Row, Col, Card, Typography, Empty, Spin } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAppSelector } from '../hooks/redux';
import type { Movie } from '../types/movie';

const { Text, Title } = Typography;

const ListContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};
`;

const MovieCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.surface} 0%, ${({ theme }) => theme.colors.background} 100%);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  
  /* Animated gradient border */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    padding: 2px;
    background: linear-gradient(45deg, 
      ${({ theme }) => theme.colors.primary}, 
      #ff6b6b, 
      #4ecdc4, 
      #ffd93d,
      ${({ theme }) => theme.colors.primary}
    );
    background-size: 400% 400%;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: subtract;
    animation: movieCardGradient 4s ease infinite;
    opacity: 0.7;
  }
  
  .ant-card-body {
    padding: ${({ theme }) => theme.spacing.md};
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    
    &::before {
      opacity: 1;
      animation: movieCardGradient 2s ease infinite;
    }
  }
  
  @keyframes movieCardGradient {
    0%, 100% {
      background-position: 0% 50%;
    }
    25% {
      background-position: 100% 50%;
    }
    50% {
      background-position: 100% 100%;
    }
    75% {
      background-position: 0% 100%;
    }
  }
`;

const MoviePoster = styled.img`
  width: 120px;
  height: 180px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-right: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100px;
    height: 150px;
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`;

const MovieContent = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  align-items: flex-start;
`;

const MovieInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MovieMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ErrorCard = styled(Card)`
  max-width: 420px;
  margin: ${({ theme }) => theme.spacing.xl} auto;
  text-align: center;
  position: relative;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.surface} 0%, ${({ theme }) => theme.colors.background} 100%);
  border: none;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 
              0 10px 20px rgba(0, 0, 0, 0.05);
  
  /* Animated gradient border */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    padding: 3px;
    background: linear-gradient(45deg, 
      ${({ theme }) => theme.colors.primary}, 
      #ff6b6b, 
      #4ecdc4, 
      ${({ theme }) => theme.colors.primary}
    );
    background-size: 300% 300%;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: subtract;
    animation: gradientShift 3s ease infinite;
  }
  
  .ant-card-body {
    padding: ${({ theme }) => theme.spacing.xl};
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15), 
                0 20px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  animation: fadeInUp 0.6s ease-out;
`;

const EmojiContainer = styled.div`
  font-size: 72px;
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

const ErrorTitle = styled(Typography.Title)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 !important;
  margin-bottom: 12px !important;
  font-weight: 700 !important;
`;

const ErrorDescription = styled(Typography.Text)`
  font-size: 16px;
  font-weight: 500;
  opacity: 0.8;
`;

// Global styles for card animations
const GlobalCardStyles = `
  @keyframes cardFadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject global styles
const style = document.createElement('style');
style.textContent = GlobalCardStyles;
document.head.appendChild(style);

const renderMovieItem = (movie: Movie, index: number) => (
  <Col 
    key={movie.id} 
    xs={24}    // 1 card per row on mobile
    sm={24}    // 1 card per row on small screens
    md={12}    // 2 cards per row on medium screens (tablets)
    lg={12}    // 2 cards per row on large screens (desktop)
    xl={12}    // 2 cards per row on extra large screens
    style={{
      animation: `cardFadeInUp 0.6s ease-out ${index * 0.1}s both`
    }}
  >
    <MovieCard>
      <MovieContent>
        <MoviePoster
          src={movie.poster && movie.poster !== 'N/A' && movie.poster.trim() ? movie.poster : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDEyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MCA2MEw4MCA2MEw2MCA5MEw0MCA2MFoiIGZpbGw9IiNEOUQ5RDkiLz4KPHN2Zz4K'}
          alt={movie.title || 'Movie poster'}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDEyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MCA2MEw4MCA2MEw2MCA5MEw0MCA2MFoiIGZpbGw9IiNEOUQ5RDkiLz4KPHN2Zz4K') {
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDEyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MCA2MEw4MCA2MEw2MCA5MEw0MCA2MFoiIGZpbGw9IiNEOUQ5RDkiLz4KPHN2Zz4K';
            }
          }}
        />
        <MovieInfo>
          <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
            {movie.title || 'Untitled Movie'}
          </Title>
          <MovieMeta>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CalendarOutlined />
              <Text type="secondary">{movie.year || 'N/A'}</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ClockCircleOutlined />
              <Text type="secondary">{movie.runtimeMinutes || 'N/A'} min</Text>
            </div>
          </MovieMeta>
          <MovieMeta style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              <StarOutlined />
              <Text type="secondary">{movie.genre?.join(', ') || 'N/A'}</Text>
            </div>
          </MovieMeta>
          <MovieMeta style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              <UserOutlined />
              <Text type="secondary">{movie.director?.join(', ') || 'N/A'}</Text>
            </div>
          </MovieMeta>
          <Text type="secondary" style={{ fontSize: '12px', marginTop: 'auto', paddingTop: '8px' }}>
            IMDb ID: {movie.omdbId || 'N/A'}
          </Text>
        </MovieInfo>
      </MovieContent>
    </MovieCard>
  </Col>
);

export const MovieList: React.FC = () => {
  const { movies, loading, error, searchQuery, totalResults } = useAppSelector((state) => state.movies);

  if (loading && movies.length === 0) {
    return (
      <LoadingContainer>
        <Spin size="large">
          <div style={{ padding: '50px' }}>
            <Text type="secondary">Searching movies...</Text>
          </div>
        </Spin>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ListContainer>
        <ErrorCard>
          <EmojiContainer>🥺</EmojiContainer>
          <ErrorTitle level={3}>
            Oops!
          </ErrorTitle>
          <ErrorDescription type="secondary">
            We can't find this movies
          </ErrorDescription>
        </ErrorCard>
      </ListContainer>
    );
  }

  if (!searchQuery && movies.length === 0) {
    return (
      <ListContainer>
        <Empty 
          description="Start typing to search for movies"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </ListContainer>
    );
  }

  if (movies.length === 0 && searchQuery) {
    return (
      <ListContainer>
        <Empty 
          description={`No movies found for "${searchQuery}"`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {searchQuery && (
        <div style={{ marginBottom: 24 }}>
          <Text type="secondary">
            Found {totalResults} results for "{searchQuery}"
          </Text>
        </div>
      )}
      <Row gutter={[16, 16]}>
        {movies.map((movie, index) => renderMovieItem(movie, index))}
      </Row>
    </ListContainer>
  );
};
