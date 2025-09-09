import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text, Title } = Typography;

const StyledModal = styled(Modal)`
  .ant-modal-body {
    background: ${({ theme }) => theme.colors.background};
    padding: 24px;
    text-align: center;
  }
`;

const IconContainer = styled.div`
  font-size: 48px;
  color: #ff4d4f;
  margin-bottom: 16px;
`;

const MovieTitle = styled(Title)`
  color: ${({ theme }) => theme.colors.text} !important;
  margin-bottom: 8px !important;
`;

const Description = styled(Text)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 16px;
`;

const DangerButton = styled(Button)`
  background: #ff4d4f;
  border: none;
  color: white;
  
  &:hover, &:focus {
    background: #ff7875 !important;
    color: white !important;
  }
`;

interface DeleteMovieConfirmationProps {
  visible: boolean;
  movieTitle: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteMovieConfirmation: React.FC<DeleteMovieConfirmationProps> = ({
  visible,
  movieTitle,
  loading,
  onConfirm,
  onCancel,
}) => {
  return (
    <StyledModal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DeleteOutlined style={{ color: '#ff4d4f' }} />
          Delete Movie
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>,
        <DangerButton
          key="delete"
          loading={loading}
          onClick={onConfirm}
        >
          Yes, Delete
        </DangerButton>,
      ]}
      width={420}
      centered
      maskClosable={!loading}
      closable={!loading}
    >
      <IconContainer>
        <ExclamationCircleOutlined />
      </IconContainer>
      
      <MovieTitle level={4}>
        Are you sure you want to delete "{movieTitle}"?
      </MovieTitle>
      
      <Description>
        This action cannot be undone. The movie will be permanently removed from your collection.
      </Description>
    </StyledModal>
  );
};
