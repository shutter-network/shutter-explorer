import {Alert, Box, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import InfoBox from "../components/InfoBox";
import useFetch from "../hooks/useFetch";

const Validator = () => {
    const { data: shutterizedValidatorsData, loading: loadingShutterized, error: errorShutterized } = useFetch('/api/shutterizedValidators', 10000);
    const { data: validatorPercentageData, loading: loadingPercentage, error: errorPercentage } = useFetch('/api/validatorPercentage', 10000);
    const { data: totalValidatorsData, loading: loadingTotal, error: errorTotal } = useFetch('/api/totalValidators', 10000);


    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <Typography variant="h5" align="left">
                Validator Overview
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    {errorShutterized ? (
                        <Alert severity="error">Error fetching shutterized validators: {errorShutterized.message}</Alert>
                    ) : (
                        <InfoBox
                            title="# Shutterized Validators"
                            tooltip="Total number of shutterized validators"
                            value={loadingShutterized ? 'Loading...' : shutterizedValidatorsData?.count || 'N/A'}
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {errorPercentage ? (
                        <Alert severity="error">Error fetching validator percentage: {errorPercentage.message}</Alert>
                    ) : (
                        <InfoBox
                            title="Validator Percentage"
                            tooltip="Percentage amongst all validators"
                            value={loadingPercentage ? 'Loading...' : `${validatorPercentageData?.percentage || 'N/A'}%`}
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {errorTotal ? (
                        <Alert severity="error">Error fetching total validators: {errorTotal.message}</Alert>
                    ) : (
                        <InfoBox
                            title="# Validators"
                            tooltip="TBD"
                            value={loadingTotal ? 'Loading...' : totalValidatorsData?.total || 'N/A'}
                        />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Validator;
