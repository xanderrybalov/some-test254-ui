import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { registerUser, clearError } from '../store/authSlice';
import type { RegisterRequest } from '../types/auth';

const { Title, Text } = Typography;

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background} 0%, ${({ theme }) => theme.colors.surface} 100%);
  padding: ${({ theme }) => theme.spacing.md};
`;

const AuthCard = styled.div`
  max-width: 400px;
  width: 100%;
  position: relative;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.surface} 0%, ${({ theme }) => theme.colors.background} 100%);
  border: none;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: ${({ theme }) => theme.spacing.xl};
  
  /* Animated gradient border */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 24px;
    padding: 3px;
    background: linear-gradient(45deg, 
      #4ecdc4,
      ${({ theme }) => theme.colors.primary}, 
      #ff6b6b, 
      #ffd93d,
      #4ecdc4
    );
    background-size: 400% 400%;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: subtract;
    animation: registerCardGradient 6s ease infinite;
    opacity: 0.8;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
  
  @keyframes registerCardGradient {
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
  
  animation: fadeInUp 0.8s ease-out;
`;

const AuthTitle = styled(Title)`
  text-align: center;
  background: linear-gradient(135deg, #4ecdc4, ${({ theme }) => theme.colors.primary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.lg} !important;
  font-weight: 700 !important;
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  .ant-input, .ant-input-password {
    border-radius: 12px;
    border: 2px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    padding: 12px 16px;
    font-size: 16px;
    
    &:hover, &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
    }
  }
  
  .ant-input-affix-wrapper {
    border-radius: 12px;
    border: 2px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    padding: 0 16px;
    
    .ant-input {
      background: transparent;
      border: none;
      box-shadow: none;
      padding: 12px 0;
      margin-left: 8px;
    }
    
    .ant-input-prefix {
      margin-right: 12px;
      color: ${({ theme }) => theme.colors.textSecondary};
      font-size: 16px;
    }
    
    .ant-input-suffix {
      margin-left: 12px;
      color: ${({ theme }) => theme.colors.textSecondary};
      font-size: 16px;
    }
    
    &:hover, &.ant-input-affix-wrapper-focused {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
      
      .ant-input-prefix, .ant-input-suffix {
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  border-radius: 12px;
  background: linear-gradient(135deg, #4ecdc4, ${({ theme }) => theme.colors.primary});
  border: none;
  font-weight: 600;
  font-size: 16px;
  margin-top: ${({ theme }) => theme.spacing.md};
  
  &:hover, &:focus {
    background: linear-gradient(135deg, #45b7b8, ${({ theme }) => theme.colors.primaryHover});
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const AuthFooter = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = (data: RegisterFormData) => {
    // Remove empty email field if not provided
    const cleanedData: RegisterRequest = {
      username: data.username,
      password: data.password,
      ...(data.email && data.email.trim() && { email: data.email.trim() }),
    };
    
    dispatch(registerUser(cleanedData));
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthTitle level={2}>
          Join Movie Finder! 🚀
        </AuthTitle>
        
        {error && (
          <Alert
            message="Registration Failed"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <StyledForm onFinish={() => handleSubmit(onSubmit)()} layout="vertical">
          <Form.Item
            label="Username"
            validateStatus={errors.username ? 'error' : ''}
            help={errors.username?.message}
          >
            <Controller
              name="username"
              control={control}
              rules={{
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers and underscore',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined />}
                  placeholder="Enter username"
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Email (Optional)"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<MailOutlined />}
                  placeholder="Enter email address"
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one lowercase, one uppercase letter and one number',
                },
              }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder="Enter password"
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            validateStatus={errors.confirmPassword ? 'error' : ''}
            help={errors.confirmPassword?.message}
          >
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder="Confirm password"
                  size="large"
                />
              )}
            />
          </Form.Item>

          <SubmitButton
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<UserAddOutlined />}
          >
            Sign Up
          </SubmitButton>
        </StyledForm>

        <AuthFooter>
          <Text type="secondary">
            Already have an account?{' '}
            <Link to="/login">Sign in here</Link>
          </Text>
        </AuthFooter>
      </AuthCard>
    </AuthContainer>
  );
};
