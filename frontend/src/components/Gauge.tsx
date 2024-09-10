import Stack from '@mui/material/Stack';
import { Gauge } from '@mui/x-charts/Gauge';
import { FC } from 'react';
import { Typography } from '@mui/material';

interface BasicGaugesProps {
    value: number;
    title?: string; // Optional title prop
}

const BasicGauges: FC<BasicGaugesProps> = ({ value, title = "Gauge Chart" }) => {
    return (
        <>
            {/* Title for the gauge chart */}
            <Typography variant="h6" align="center" gutterBottom>
                {title}
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}>
                <Gauge width={100} height={100} value={value} />
                <Gauge width={100} height={100} value={value} startAngle={-90} endAngle={90} />
            </Stack>
        </>
    );
};

export default BasicGauges;
