import { Paper, Box } from '@mui/material';
import styled from 'styled-components';

export const CardContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #ccced0;
  height: 100%;
`;

export const CardHeader = styled.div<{ centerTitle?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ centerTitle }) => (centerTitle ? 'center' : 'flex-start')};
  gap: 8px;
  margin-bottom: 16px;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const Icon = styled.img`
  width: 32px;
  height: 32px;
  filter: brightness(0) saturate(100%) invert(17%) sepia(100%) saturate(1975%) hue-rotate(199deg) brightness(99%) contrast(101%);
`;

export const CardContent = styled(Box).attrs({
  className: 'card-content',
})`
  flex-grow: 1;
`;