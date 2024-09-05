import { Alert, Box, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import InfoBox from "../components/InfoBox";
import useFetchWithPolling from "../hooks/useFetchWithPolling";

const Validator = () => {
    const { data: shutterizedValidatorsData, loading: loadingShutterized, error: errorShutterized } = useFetchWithPolling('/api/validator/shutterized_validators', 10000);
    const { data: validatorPercentageData, loading: loadingPercentage, error: errorPercentage } = useFetchWithPolling('/api/validator/validator_percentage', 10000);
    const { data: totalValidatorsData, loading: loadingTotal, error: errorTotal } = useFetchWithPolling('/api/validator/total_validators', 10000);

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <Typography variant="h5" align="left">
                Validator Overview
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    {errorShutterized ? (
                        <Alert severity="error">Error fetching shutterized validators: {errorShutterized.message}</Alert>
                    ) : (
                        <InfoBox
                            title="# Shutterized Validators"
                            tooltip="Total number of shutterized validators"
                            value={loadingShutterized ? 'Loading...' : shutterizedValidatorsData?.count || 'N/A'}
                        />
                    )}
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    {errorPercentage ? (
                        <Alert severity="error">Error fetching validator percentage: {errorPercentage.message}</Alert>
                    ) : (
                        <InfoBox
                            title="Validator Percentage"
                            tooltip="Percentage amongst all validators"
                            value={loadingPercentage ? 'Loading...' : `${validatorPercentageData?.percentage || 'N/A'}%`}
                        />
                    )}
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    {errorTotal ? (
                        <Alert severity="error">Error fetching total validators: {errorTotal.message}</Alert>
                    ) : (
                        <InfoBox
                            title="# Validators"
                            tooltip="TBD"
                            value={loadingTotal ? 'Loading...' : totalValidatorsData?.total || 'N/A'}
                        />
                    )}
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default Validator;
