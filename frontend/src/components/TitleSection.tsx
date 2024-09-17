import React from 'react';
import { Typography } from '@mui/material';
import { TitleContainer, Logo } from '../styles/titleSection';
import gnosisLogo from '../assets/icons/gnosis.svg';

interface TitleSectionProps {
    title: string;
}

const TitleSection: React.FC<TitleSectionProps> = ({ title }) => {
    return (
        <TitleContainer>
            <Logo src={gnosisLogo} alt="Gnosis Logo" />
            <Typography variant="h1">{title}</Typography>
        </TitleContainer>
    );
};

export default TitleSection;

