import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Typography, Button, Card, Tag, Tooltip } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, VideoCameraOutlined, StarOutlined, StarFilled, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleFavorite } from '../store/favoritesSlice';
import { deleteUserMovie, fetchUserMovies } from '../store/userMovieSlice';
import { DeleteMovieConfirmation } from './DeleteMovieConfirmation';
import { Header } from './Header';
import type { Movie } from '../types/movie';

const { Content } = Layout;
const { Title, Text  } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const StyledContent = styled(Content)`
  background: ${({ theme }) => theme.colors.background};
`;

const DetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const BackButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  
  &:hover, &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`;

const MovieCard = styled(Card)`
  border: none;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.surface} 0%, ${({ theme }) => theme.colors.background} 100%);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 
              0 10px 20px rgba(0, 0, 0, 0.05);
  
  /* Animated gradient border */
  position: relative;
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
      #ffd93d,
      ${({ theme }) => theme.colors.primary}
    );
    background-size: 400% 400%;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: subtract;
    animation: gradientShift 4s ease infinite;
    opacity: 0.8;
  }
  
  .ant-card-body {
    padding: ${({ theme }) => theme.spacing.xl};
    position: relative;
    z-index: 1;
  }
  
  @keyframes gradientShift {
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

const MovieHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const PosterContainer = styled.div`
  flex-shrink: 0;
  position: relative;
`;

const MoviePoster = styled.img`
  width: 300px;
  height: 450px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 768px) {
    width: 250px;
    height: 375px;
  }
`;

const MovieInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MovieTitle = styled(Title)`
  color: ${({ theme }) => theme.colors.text} !important;
  margin-bottom: ${({ theme }) => theme.spacing.sm} !important;
  
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700 !important;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  
  .anticon {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const GenreContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const GenreTag = styled(Tag)`
  border: none;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}20, #ff6b6b20);
  color: ${({ theme }) => theme.colors.primary};
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const FavoriteButton = styled(Button)<{ $isFavorite: boolean }>`
  border: none;
  background: ${props => props.$isFavorite 
    ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' 
    : 'linear-gradient(135deg, #6b7280, #9ca3af)'
  };
  color: white;
  border-radius: 8px;
  font-weight: 600;
  
  &:hover, &:focus {
    background: ${props => props.$isFavorite 
      ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' 
      : 'linear-gradient(135deg, #9ca3af, #6b7280)'
    };
    color: white;
    transform: translateY(-2px);
  }
`;

const DeleteButton = styled(Button)`
  border: none;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  
  &:hover, &:focus {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: white;
    transform: translateY(-2px);
  }
`;

const NotFoundContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { movies } = useAppSelector((state) => state.movies);
  const { userMovies } = useAppSelector((state) => state.userMovies);
  const { favoriteMovies, favoriteMovieIds } = useAppSelector((state) => state.favorites);
  
  const [deleteConfirmation, setDeleteConfirmation] = React.useState<{
    visible: boolean;
    movieId: string;
    movieTitle: string;
  }>({
    visible: false,
    movieId: '',
    movieTitle: '',
  });

  // Find movie in all available sources
  const movie = React.useMemo((): Movie | undefined => {
    const allMovies = [...movies, ...userMovies, ...favoriteMovies];
    return allMovies.find(m => m.id === id);
  }, [id, movies, userMovies, favoriteMovies]);

  const isFavorite = movie ? favoriteMovieIds.includes(movie.id) : false;
  const canDelete = movie ? userMovies.some(userMovie => userMovie.id === movie.id) : false;

  const handleBack = () => {
    navigate(-1);
  };

  const handleToggleFavorite = () => {
    if (isAuthenticated && user?.id && movie) {
      dispatch(toggleFavorite({ userId: user.id, movieId: movie.id }));
    }
  };

  const handleDeleteMovie = () => {
    if (movie) {
      setDeleteConfirmation({
        visible: true,
        movieId: movie.id,
        movieTitle: movie.title,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (isAuthenticated && user?.id && deleteConfirmation.movieId) {
      try {
        await dispatch(deleteUserMovie({
          userId: user.id,
          movieId: deleteConfirmation.movieId,
        })).unwrap();
        
        dispatch(fetchUserMovies(user.id));
        setDeleteConfirmation({ visible: false, movieId: '', movieTitle: '' });
        
        // Navigate back to home after deletion
        navigate('/');
      } catch {
        // Error handled in slice
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ visible: false, movieId: '', movieTitle: '' });
  };

  if (!movie) {
    return (
      <StyledLayout>
        <Header />
        <StyledContent>
          <DetailsContainer>
            <BackButton 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
            >
              Back to Movies
            </BackButton>
            <NotFoundContainer>
              <Title level={2}>Movie Not Found</Title>
              <Text type="secondary">The movie you're looking for doesn't exist or has been removed.</Text>
            </NotFoundContainer>
          </DetailsContainer>
        </StyledContent>
      </StyledLayout>
    );
  }

  return (
    <StyledLayout>
      <Header />
      <StyledContent>
        <DetailsContainer>
          <BackButton 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
          >
            Back to Movies
          </BackButton>
          
          <MovieCard>
            <MovieHeader>
              <PosterContainer>
                <MoviePoster
                  src={movie.poster && movie.poster !== 'N/A' && movie.poster.trim() ? 
                    movie.poster : 
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgMTUwTDIwMCAxNTBMMTUwIDI1MEwxMDAgMTUwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K'
                  }
                  alt={movie.title || 'Movie poster'}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('data:image')) {
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgMTUwTDIwMCAxNTBMMTUwIDI1MEwxMDAgMTUwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K';
                    }
                  }}
                />
              </PosterContainer>

              <MovieInfo>
                <MovieTitle level={1}>
                  {movie.title || 'Untitled Movie'}
                </MovieTitle>

                <MetaInfo>
                  <MetaItem>
                    <CalendarOutlined />
                    <Text>{movie.year || 'N/A'}</Text>
                  </MetaItem>
                  <MetaItem>
                    <ClockCircleOutlined />
                    <Text>{movie.runtimeMinutes || 'N/A'} minutes</Text>
                  </MetaItem>
                  <MetaItem>
                    <VideoCameraOutlined />
                    <Text>{movie.source === 'custom' ? 'Custom Movie' : 'IMDb'}</Text>
                  </MetaItem>
                </MetaInfo>

                {movie.genre && movie.genre.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <Text strong style={{ marginBottom: '8px', display: 'block' }}>Genres:</Text>
                    <GenreContainer>
                      {movie.genre.map((genre, index) => (
                        <GenreTag key={index}>{genre}</GenreTag>
                      ))}
                    </GenreContainer>
                  </div>
                )}

                {movie.director && movie.director.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <MetaItem>
                      <UserOutlined />
                      <Text strong>Director(s): </Text>
                      <Text>{movie.director.join(', ')}</Text>
                    </MetaItem>
                  </div>
                )}

                {movie.omdbId && (
                  <div style={{ marginBottom: '24px' }}>
                    <Text type="secondary">
                      IMDb ID: {movie.omdbId}
                    </Text>
                  </div>
                )}

                {isAuthenticated && (
                  <ActionButtons>
                    <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                      <FavoriteButton
                        $isFavorite={isFavorite}
                        icon={isFavorite ? <StarFilled /> : <StarOutlined />}
                        onClick={handleToggleFavorite}
                      >
                        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                      </FavoriteButton>
                    </Tooltip>

                    {canDelete && (
                      <Tooltip title="Delete this movie">
                        <DeleteButton
                          icon={<DeleteOutlined />}
                          onClick={handleDeleteMovie}
                        >
                          Delete Movie
                        </DeleteButton>
                      </Tooltip>
                    )}
                  </ActionButtons>
                )}
              </MovieInfo>
            </MovieHeader>
          </MovieCard>
        </DetailsContainer>

        {/* Delete Confirmation Modal */}
        <DeleteMovieConfirmation
          visible={deleteConfirmation.visible}
          movieTitle={deleteConfirmation.movieTitle}
          loading={false}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </StyledContent>
    </StyledLayout>
  );
};
