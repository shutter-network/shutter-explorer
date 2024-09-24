import Stack from '@mui/material/Stack';
import {Gauge, gaugeClasses} from '@mui/x-charts/Gauge';
import { FC } from 'react';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface BasicGaugesProps {
    value: number;
    title?: string;
    gaugeColor?: string;
    labelColor?: string;
}

const BasicGauges: FC<BasicGaugesProps> = ({ value, title = "Gauge Chart", gaugeColor = '#00aaff', labelColor = '#000' }) => {
    const theme = useTheme();

    return (
        <>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: labelColor }}>
                {title}
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}>
                <Gauge width={100} height={100} value={value} startAngle={-90} endAngle={90}
                       sx={{
                           [`& .${gaugeClasses.valueArc}`]: {
                               fill: theme.palette.success.main,
                           },
                           [`& .${gaugeClasses.referenceArc}`]: {
                               fill: theme.palette.error.main,
                           },
                       }}
                />
            </Stack>
        </>
    );
};

export default BasicGauges;
