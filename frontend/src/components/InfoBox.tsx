// @ts-ignore
import React from "react";
import { Paper, Typography, Tooltip } from '@mui/material';

interface InfoBoxProps {
    title: string;
    tooltip: string;
    value: string | number;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, tooltip, value }) => {
    return (
        <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
            <Tooltip title={tooltip}>
                <Typography variant="h6">{title}</Typography>
            </Tooltip>
            <Typography variant="body1">{value}</Typography>
        </Paper>
    );
};

export default InfoBox;
