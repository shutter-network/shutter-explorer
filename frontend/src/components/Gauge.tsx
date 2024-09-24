import Stack from '@mui/material/Stack';
import {Gauge, gaugeClasses} from '@mui/x-charts/Gauge';
import { FC } from 'react';
import { useTheme } from '@mui/material/styles';

interface BasicGaugesProps {
    value: number;
}

const BasicGauges: FC<BasicGaugesProps> = ({ value}) => {
    const theme = useTheme();

    return (
        <>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} sx={{ width: '100%', height: '100%' }}>
                <Gauge value={value} startAngle={-90} endAngle={90}
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
