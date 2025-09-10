import React, { useEffect } from 'react';
import { Modal, Input, InputNumber, Button, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { editUserMovie } from '../store/userMovieSlice';
import type { EditMovieData } from '../types/userMovie';
import type { Movie } from '../types/movie';

const StyledModal = styled(Modal)`
  
  .ant-modal-body {
    background: ${({ theme }) => theme.colors.background};
    padding: 24px;
  }
`;

const FormField = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
  
  .error {
    color: #ff4d4f;
    font-size: 14px;
    margin-top: 4px;
  }
`;

const StyledInput = styled(Input)`
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  
  &:hover, &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const StyledInputNumber = styled(InputNumber)`
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  
  &:hover, &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const ArrayFieldContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.surface};
`;

const ArrayItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

interface EditMovieModalProps {
  visible: boolean;
  onClose: () => void;
  movie: Movie | null;
}

interface FormData extends EditMovieData {
  genreItems: Array<{ value: string }>;
  directorItems: Array<{ value: string }>;
}

export const EditMovieModal: React.FC<EditMovieModalProps> = ({ visible, onClose, movie }) => {
  const dispatch = useAppDispatch();
  const { editLoading, error } = useAppSelector((state) => state.userMovies);
  const { user } = useAppSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      year: new Date().getFullYear(),
      runtimeMinutes: 0,
      genreItems: [{ value: '' }],
      directorItems: [{ value: '' }],
    },
  });

  const {
    fields: genreFields,
    append: appendGenre,
    remove: removeGenre,
  } = useFieldArray({
    control,
    name: 'genreItems',
  });

  const {
    fields: directorFields,
    append: appendDirector,
    remove: removeDirector,
  } = useFieldArray({
    control,
    name: 'directorItems',
  });

  // Update form when movie data changes
  useEffect(() => {
    if (movie && visible) {
      reset({
        title: movie.title || '',
        year: movie.year || new Date().getFullYear(),
        runtimeMinutes: movie.runtimeMinutes || 0,
        genreItems: movie.genre && movie.genre.length > 0 
          ? movie.genre.map(g => ({ value: g }))
          : [{ value: '' }],
        directorItems: movie.director && movie.director.length > 0 
          ? movie.director.map(d => ({ value: d }))
          : [{ value: '' }],
      });
    }
  }, [movie, visible, reset]);

  const onSubmit = async (data: FormData) => {
    if (!user?.id || !movie?.id) return;

    const movieData: EditMovieData = {
      title: data.title.trim(),
      year: data.year,
      runtimeMinutes: data.runtimeMinutes,
      genre: data.genreItems.map(item => item.value.trim()).filter(Boolean),
      director: data.directorItems.map(item => item.value.trim()).filter(Boolean),
    };

    try {
      await dispatch(editUserMovie({
        userId: user.id,
        movieId: movie.id,
        movieData,
      })).unwrap();

      // List will be automatically refreshed by useEffect in MovieList
      message.success('Movie updated successfully!');
      handleClose();
    } catch (error: unknown) {
      message.error(error instanceof Error ? error.message : 'Failed to update movie');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const currentYear = new Date().getFullYear();

  return (
    <StyledModal
      title="Edit Movie"
      open={visible}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={editLoading}
          onClick={handleSubmit(onSubmit)}
        >
          Save Changes
        </Button>,
      ]}
      width={600}
      destroyOnHidden
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <FormField>
          <label>Title *</label>
          <Controller
            name="title"
            control={control}
            rules={{
              required: 'Title is required',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters',
              },
              validate: (value) => {
                return value.trim().length >= 3 || 'Title must be at least 3 characters';
              },
            }}
            render={({ field }) => (
              <StyledInput
                {...field}
                placeholder="Enter movie title"
                status={errors.title ? 'error' : ''}
              />
            )}
          />
          {errors.title && <div className="error">{errors.title.message}</div>}
        </FormField>

        {/* Year */}
        <FormField>
          <label>Year *</label>
          <Controller
            name="year"
            control={control}
            rules={{
              required: 'Year is required',
              min: {
                value: 1888,
                message: 'Year must be after 1888 (first movie year)',
              },
              max: {
                value: currentYear + 5,
                message: `Year cannot be more than ${currentYear + 5}`,
              },
            }}
            render={({ field }) => (
              <StyledInputNumber
                {...field}
                placeholder="Enter release year"
                min={1888}
                max={currentYear + 5}
                status={errors.year ? 'error' : ''}
              />
            )}
          />
          {errors.year && <div className="error">{errors.year.message}</div>}
        </FormField>

        {/* Runtime */}
        <FormField>
          <label>Runtime (minutes) *</label>
          <Controller
            name="runtimeMinutes"
            control={control}
            rules={{
              required: 'Runtime is required',
              min: {
                value: 1,
                message: 'Runtime must be at least 1 minute',
              },
              max: {
                value: 600,
                message: 'Runtime cannot exceed 600 minutes',
              },
            }}
            render={({ field }) => (
              <StyledInputNumber
                {...field}
                placeholder="Enter runtime in minutes"
                min={1}
                max={600}
                status={errors.runtimeMinutes ? 'error' : ''}
              />
            )}
          />
          {errors.runtimeMinutes && <div className="error">{errors.runtimeMinutes.message}</div>}
        </FormField>

        {/* Genre */}
        <FormField>
          <label>Genre *</label>
          <ArrayFieldContainer>
            {genreFields.map((field, index) => (
              <ArrayItem key={field.id}>
                <Controller
                  name={`genreItems.${index}.value`}
                  control={control}
                  rules={{
                    required: index === 0 ? 'At least one genre is required' : false,
                    minLength: {
                      value: 3,
                      message: 'Genre must be at least 3 characters',
                    },
                  }}
                  render={({ field: inputField }) => (
                    <StyledInput
                      {...inputField}
                      placeholder="Enter genre"
                      status={errors.genreItems?.[index]?.value ? 'error' : ''}
                      style={{ flex: 1 }}
                    />
                  )}
                />
                {genreFields.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeGenre(index)}
                  />
                )}
              </ArrayItem>
            ))}
            {genreFields.map((field, index) => 
              errors.genreItems?.[index]?.value && (
                <div key={`error-${field.id}`} className="error">
                  {errors.genreItems[index]?.value?.message}
                </div>
              )
            )}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => appendGenre({ value: '' })}
              style={{ marginTop: 8, width: '100%' }}
            >
              Add Genre
            </Button>
          </ArrayFieldContainer>
        </FormField>

        {/* Director */}
        <FormField>
          <label>Director *</label>
          <ArrayFieldContainer>
            {directorFields.map((field, index) => (
              <ArrayItem key={field.id}>
                <Controller
                  name={`directorItems.${index}.value`}
                  control={control}
                  rules={{
                    required: index === 0 ? 'At least one director is required' : false,
                    minLength: {
                      value: 3,
                      message: 'Director name must be at least 3 characters',
                    },
                  }}
                  render={({ field: inputField }) => (
                    <StyledInput
                      {...inputField}
                      placeholder="Enter director name"
                      status={errors.directorItems?.[index]?.value ? 'error' : ''}
                      style={{ flex: 1 }}
                    />
                  )}
                />
                {directorFields.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeDirector(index)}
                  />
                )}
              </ArrayItem>
            ))}
            {directorFields.map((field, index) => 
              errors.directorItems?.[index]?.value && (
                <div key={`error-${field.id}`} className="error">
                  {errors.directorItems[index]?.value?.message}
                </div>
              )
            )}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => appendDirector({ value: '' })}
              style={{ marginTop: 8, width: '100%' }}
            >
              Add Director
            </Button>
          </ArrayFieldContainer>
        </FormField>

        {error && (
          <div style={{ color: '#ff4d4f', marginBottom: 16, textAlign: 'center' }}>
            {error}
          </div>
        )}
      </form>
    </StyledModal>
  );
};
