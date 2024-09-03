import { Box, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Use Grid2
import InfoBox from '../components/InfoBox';
import BasicGauges from '../components/Gauge';
import HistogramChart from '../components/HistogramChart';
import CustomLineChart from '../components/CustomLineChart';
import { FC } from "react";

const InclusionTime: FC = () => {
    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <Typography variant="h5" align="left">
                Inclusion Time Overview
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <InfoBox
                        title="Estimated Inclusion Time"
                        tooltip="Average inclusion time for a shutterized block"
                        value="10 mins"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ padding: 2 }}>
                        <BasicGauges />
                    </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ padding: 2 }}>
                        <HistogramChart />
                    </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ padding: 2 }}>
                        <CustomLineChart />
                    </Box>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default InclusionTime;
