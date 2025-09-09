import React from 'react';
import { Input, Button, Space, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { searchMovies, setSearchQuery, clearMovies } from '../store/movieSlice';
import { setShowFavoritesOnly } from '../store/favoritesSlice';

const SearchContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};
`;

const StyledForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;
  
  .ant-input-search {
    flex: 1;
  }
`;

interface SearchFormData {
  query: string;
}

export const MovieSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, searchQuery, error } = useAppSelector((state) => state.movies);
  const { loading: favoritesLoading } = useAppSelector((state) => state.favorites);
  
  const { control, handleSubmit, reset, watch } = useForm<SearchFormData>({
    defaultValues: {
      query: searchQuery,
    },
  });

  const queryValue = watch('query');

  const onSubmit = (data: SearchFormData) => {
    if (data.query.trim()) {
      // Exit favorites mode when starting a new search
      dispatch(setShowFavoritesOnly(false));
      dispatch(setSearchQuery(data.query.trim()));
      dispatch(searchMovies({ query: data.query.trim(), page: 1 }));
    }
  };

  const handleClear = () => {
    reset({ query: '' });
    dispatch(setSearchQuery(''));
    dispatch(clearMovies());
  };

  return (
    <SearchContainer>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="query"
          control={control}
          rules={{
            required: 'Please enter a movie title',
            minLength: {
              value: 2,
              message: 'Search query must be at least 2 characters',
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Input.Search
              {...field}
              placeholder="Search for movies..."
              size="large"
              loading={loading || favoritesLoading}
              allowClear
              enterButton={
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />}
                  htmlType="submit"
                  loading={loading || favoritesLoading}
                >
                  Search
                </Button>
              }
              onSearch={(value) => {
                if (value.trim()) {
                  // Exit favorites mode when starting a new search
                  dispatch(setShowFavoritesOnly(false));
                  field.onChange(value);
                  dispatch(setSearchQuery(value.trim()));
                  dispatch(searchMovies({ query: value.trim(), page: 1 }));
                }
              }}
              status={error ? 'error' : ''}
            />
          )}
        />
      </StyledForm>
      
      {/* Connection Error Alert */}
      {error && error.includes('fetch') && (
        <Alert
          message="Connection Error"
          description="Failed to connect to backend API. Please make sure the server is running."
          type="error"
          style={{ marginTop: 16 }}
          showIcon
          closable
        />
      )}
      
      {queryValue && (
        <Space style={{ marginTop: 16 }}>
          <Button type="link" onClick={handleClear} size="small">
            Clear search
          </Button>
        </Space>
      )}
    </SearchContainer>
  );
};
