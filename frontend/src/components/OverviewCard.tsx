import React, { FC } from 'react';
import { Typography } from '@mui/material';
import { CardContainer, CardHeader, IconWrapper, Icon, CardContent } from '../styles/overviewCard';
import RefreshContainer from './RefreshContainer';

interface OverviewCardProps {
    title: string;
    iconSrc?: string;
    children: React.ReactNode;
    centerTitle?: boolean;
    timeAgo?: string;
}

const OverviewCard: FC<OverviewCardProps> = ({ title, iconSrc, children, centerTitle = false, timeAgo }) => {
    return (
        <CardContainer>
            <CardHeader centerTitle={centerTitle}>
                {iconSrc && (
                    <IconWrapper>
                        <Icon src={iconSrc} alt={`${title} icon`} />
                    </IconWrapper>
                )}
                <Typography variant="h2">
                    {title}
                </Typography>
                {timeAgo && <RefreshContainer time={timeAgo} />}
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </CardContainer>
    );
};

export default OverviewCard;
