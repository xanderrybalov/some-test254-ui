import React from 'react';
import { List, Card, Typography, Empty, Alert, Spin } from 'antd';
import { CalendarOutlined, VideoCameraOutlined } from '@ant-design/icons';
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
  .ant-card-body {
    padding: ${({ theme }) => theme.spacing.md};
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
    transition: all 0.3s ease;
  }
`;

const MoviePoster = styled.img`
  width: 120px;
  height: 180px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-right: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 80px;
    height: 120px;
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`;

const MovieContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
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

const renderMovieItem = (movie: Movie) => (
  <List.Item key={movie.imdbID} style={{ border: 'none', padding: 0, marginBottom: 16 }}>
    <MovieCard>
      <MovieContent>
        <MoviePoster
          src={movie.poster !== 'N/A' ? movie.poster : '/placeholder-movie.png'}
          alt={movie.title}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDEyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MCA2MEw4MCA2MEw2MCA5MEw0MCA2MFoiIGZpbGw9IiNEOUQ5RDkiLz4KPHN2Zz4K';
          }}
        />
        <MovieInfo>
          <Title level={4} style={{ margin: 0 }}>
            {movie.title}
          </Title>
          <MovieMeta>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CalendarOutlined />
              <Text type="secondary">{movie.year}</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <VideoCameraOutlined />
              <Text type="secondary">{movie.type}</Text>
            </div>
          </MovieMeta>
          <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
            IMDb ID: {movie.imdbID}
          </Text>
        </MovieInfo>
      </MovieContent>
    </MovieCard>
  </List.Item>
);

export const MovieList: React.FC = () => {
  const { movies, loading, error, searchQuery, totalResults } = useAppSelector((state) => state.movies);

  if (loading && movies.length === 0) {
    return (
      <LoadingContainer>
        <Spin size="large" tip="Searching movies..." />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ListContainer>
        <Alert
          message="Search Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
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
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Found {totalResults} results for "{searchQuery}"
          </Text>
        </div>
      )}
      <List
        dataSource={movies}
        renderItem={renderMovieItem}
        loading={loading}
      />
    </ListContainer>
  );
};
