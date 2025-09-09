import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { verifyToken } from '../store/authSlice';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background} 0%, ${({ theme }) => theme.colors.surface} 100%);
`;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, loading, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If we have a token but not authenticated, verify it
    if (token && !isAuthenticated && !loading) {
      dispatch(verifyToken());
    }
  }, [dispatch, token, isAuthenticated, loading]);

  // Show loading spinner while verifying token
  if (loading) {
    return (
      <LoadingContainer>
        <Spin size="large">
          <div style={{ padding: '50px' }}>
            <div style={{ color: '#666' }}>Verifying authentication...</div>
          </div>
        </Spin>
      </LoadingContainer>
    );
  }

  // If not authenticated, redirect to login with return url
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected component
  return <>{children}</>;
};
