import { FC } from "react";
import { Paper, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface InfoBoxProps {
    title: string;
    tooltip: string;
    value: string | number | string[];
}

const InfoBox: FC<InfoBoxProps> = ({ title, tooltip, value }) => {
    return (
        <Paper elevation={0} sx={{ padding: 2, textAlign: 'left' }}>
            {/* Display value with subtitle1 style */}
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
            {/* Display title with body1 (body small) style */}
            <Tooltip title={tooltip}>
                <Typography variant="body1">
                {/* <InfoIcon style={{ cursor: 'pointer' }} /> */}

                    {title}</Typography>
            </Tooltip>
        </Paper>
    );
};

export default InfoBox;
