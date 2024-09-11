import React, { FC } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import styled from 'styled-components';

interface OverviewCardProps {
    title: string;
    iconSrc?: string;
    children: React.ReactNode;
}

const OverviewCard: FC<OverviewCardProps> = ({ title, iconSrc, children }) => {
    return (
        <CardContainer>
            <CardHeader>
                {iconSrc && <img src={iconSrc} alt={`${title} icon`} />}
                <Typography variant="h6">{title}</Typography>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </CardContainer>
    );
};

export default OverviewCard;

const CardContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #ccced0;
  height: 100%;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  img {
    width: 32px;
    height: 32px;
  }

  h6 {
    font-size: 24px;
    font-weight: 600;
    color: #051016;
    letter-spacing: -1.2px;
  }
`;

const CardContent = styled(Box)`
  margin-top: 16px;
  flex-grow: 1;
`;
