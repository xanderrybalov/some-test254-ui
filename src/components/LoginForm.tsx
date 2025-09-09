import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser, clearError } from '../store/authSlice';
import type { LoginRequest } from '../types/auth';

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
      ${({ theme }) => theme.colors.primary}, 
      #ff6b6b, 
      #4ecdc4, 
      #ffd93d,
      ${({ theme }) => theme.colors.primary}
    );
    background-size: 400% 400%;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: subtract;
    animation: authCardGradient 6s ease infinite;
    opacity: 0.8;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
  
  @keyframes authCardGradient {
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
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #ff6b6b);
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
    height: 48px;
    border-radius: 12px;
    border: 2px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    
    &:hover, &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
    }
  }
  
  .ant-input-affix-wrapper {
    height: 48px;
    border-radius: 12px;
    border: 2px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    
    &:hover, &.ant-input-affix-wrapper-focused {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
    }
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #ff6b6b);
  border: none;
  font-weight: 600;
  font-size: 16px;
  margin-top: ${({ theme }) => theme.spacing.md};
  
  &:hover, &:focus {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryHover}, #ff5252);
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

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    defaultValues: {
      login: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = (data: LoginRequest) => {
    dispatch(loginUser(data));
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthTitle level={2}>
          Welcome Back! 🎬
        </AuthTitle>
        
        {error && (
          <Alert
            message="Login Failed"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <StyledForm onFinish={() => handleSubmit(onSubmit)()} layout="vertical">
          <Form.Item
            label="Username or Email"
            validateStatus={errors.login ? 'error' : ''}
            help={errors.login?.message}
          >
            <Controller
              name="login"
              control={control}
              rules={{
                required: 'Username or email is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined />}
                  placeholder="Enter username or email"
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

          <SubmitButton
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<LoginOutlined />}
          >
            Sign In
          </SubmitButton>
        </StyledForm>

        <AuthFooter>
          <Text type="secondary">
            Don't have an account?{' '}
            <Link to="/register">Sign up here</Link>
          </Text>
        </AuthFooter>
      </AuthCard>
    </AuthContainer>
  );
};
