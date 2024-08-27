import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import InfoBox from '../components/InfoBox';
import BasicGauges from '../components/Gauge';
import HistogramChart from '../components/HistogramChart';
import CustomLineChart from '../components/CustomLineChart';

const InclusionTime: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <Typography variant="h5" align="left">
                Inclusion Time Overview
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <InfoBox
                        title="Estimated Inclusion Time"
                        tooltip="Average inclusion time for a shutterized block"
                        value="10 mins"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ padding: 2 }}>
                        <BasicGauges />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ padding: 2 }}>
                        <HistogramChart />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ padding: 2 }}>
                        <CustomLineChart />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default InclusionTime;
