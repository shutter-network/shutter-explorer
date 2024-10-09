import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { FC } from 'react';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

interface BasicGaugesProps {
    success: number;
    total: number;
    failed: number;
}

const BasicGauges: FC<BasicGaugesProps> = ({ success, total, failed }) => {
    const theme = useTheme();
    const value = (success / total) * 100;

    return (
        <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: '100%', height: '100%', padding: '0 0' }}
        >
            {/* Gauge Element */}
            <Box sx={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 0' }}>
                <Gauge
                    value={value}
                    startAngle={-90}
                    endAngle={90}
                    sx={{
                        width: '100%',
                        height: '80%',
                        [`& .${gaugeClasses.valueText}`]: {
                            display: 'none',
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: theme.palette.success.main,
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                            fill: theme.palette.error.main,
                        },
                        '@media (max-width: 768px)': {
                            height: '150px',
                        },
                    }}
                />
            </Box>

            {/* Line for Successful, Total, Failed */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                sx={{ padding: '0 0' }}
            >
                <Stack alignItems="center">
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                        Successful
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary }}>
                        {success}
                    </Typography>
                </Stack>
                <Stack alignItems="center">
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                        Total
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary }}>
                        {total}
                    </Typography>
                </Stack>
                <Stack alignItems="center">
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                        Failed
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary }}>
                        {failed}
                    </Typography>
                </Stack>
            </Box>
        </Stack>
    );
};

export default BasicGauges;
