import { FC } from "react";
import { Box, Paper, Tooltip, Typography } from '@mui/material';
import { ReactComponent as InfoIcon } from '../assets/icons/info.svg';

interface InfoBoxProps {
    title: string;
    tooltip: string;
    value: string | number | string[];
}

const InfoBox: FC<InfoBoxProps> = ({ title, tooltip, value }) => {
    return (
        <Paper elevation={0} sx={{ textAlign: 'left', paddingTop: 2, paddingBottom: 2 }}>
            <Typography variant="subtitle1">
                {Array.isArray(value) ? (
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {value.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    value
                )}
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body1">
                    {title}
                </Typography>
                <Tooltip title={tooltip}>
                    <InfoIcon />
                </Tooltip>
            </Box>
        </Paper>
    );
};

export default InfoBox;
