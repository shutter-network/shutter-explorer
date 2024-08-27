import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import InfoBox from "../components/InfoBox";

const Transaction = () => {
    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <Typography variant="h5" align="left">
                Transaction Overview
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <InfoBox
                        title="# Successfully Executed Transactions"
                        tooltip="TBD"
                        value="987"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InfoBox
                        title="# Shutterized Transactions per Month"
                        tooltip="TBD"
                        value="25"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InfoBox
                        title="Percentage of Shutterized Transactions"
                        tooltip="TBD"
                        value="10%"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Transaction;
