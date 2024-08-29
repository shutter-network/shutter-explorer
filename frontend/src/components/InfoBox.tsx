import {FC} from "react";
import {Paper, Tooltip, Typography} from '@mui/material';

interface InfoBoxProps {
    title: string;
    tooltip: string;
    value: string | number | string[];
}

const InfoBox: FC<InfoBoxProps> = ({ title, tooltip, value }) => {
    return (
        <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
            <Tooltip title={tooltip}>
                <Typography variant="h6">{title}</Typography>
            </Tooltip>
            <Typography variant="body1">
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
        </Paper>
    );
};

export default InfoBox;
