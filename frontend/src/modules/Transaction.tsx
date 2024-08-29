import { Box, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import InfoBox from "../components/InfoBox";

const Transaction = () => {
    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <Typography variant="h5" align="left">
                Transaction Overview
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <InfoBox
                        title="# Successfully Executed Transactions"
                        tooltip="TBD"
                        value="987"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <InfoBox
                        title="# Shutterized Transactions per Month"
                        tooltip="TBD"
                        value="25"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <InfoBox
                        title="Percentage of Shutterized Transactions"
                        tooltip="TBD"
                        value="10%"
                    />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default Transaction;
