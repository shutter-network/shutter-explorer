import React from 'react';
import {Grid, Box, Typography} from '@mui/material';
import InfoBox from "../components/InfoBox";

const Keyper : React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <Typography variant="h5" align="left">
                Keyper Overview
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <InfoBox
                        title="# Gnosis Chain Keypers"
                        tooltip="Shutter DAOs have already selected and approved 22 keypers to be eligible to operate
                        keyper clients for various Shutter-protected protocols (e.g. Shutter for Gnosis Chain or Shutter
                         for Snapshot Shielded Voting). The current subset of 7 are voluntary Genesis Keypers
                         specifically for Gnosis Chain. More on the process on how to become a keyper:
                         https://blog.shutter.network/become-a-keyper-for-shutter-network/"
                        value="123"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InfoBox
                        title="Keyper Threshold"
                        tooltip="Threshold number of keypers required for operation."
                        value="25%"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Keyper;
