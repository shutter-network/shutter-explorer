import Validator from '../modules/Validator';
import Transaction from '../modules/Transaction';
import InclusionTime from '../modules/InclusionTime';
import ResponsiveLayout from "../components/ResponsiveLayout";
import Keyper from "../modules/Keyper";
import Grid from '@mui/material/Grid2';
import TitleSection from "../components/TitleSection";
import TransactionGauge from "../modules/TransactionGauge";

const System = () => {
    return (
        <ResponsiveLayout>
            <TitleSection title="System Overview" />
            <Grid container spacing={3} alignItems="stretch">
                {/* Validator Section */}
                <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Validator />
                </Grid>

                {/* Transaction Section */}
                <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Transaction />
                </Grid>

                {/* Keyper Section */}
                <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Keyper />
                </Grid>

                {/* Inclusion Time Section */}
                <Grid
                    size={{ xs: 12, sm: 8 }}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        width: '100%',
                    }}
                >
                    <InclusionTime />
                </Grid>

                {/* Transaction Gauge Section */}
                <Grid
                    size={{ xs: 12, sm: 4 }}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        width: '100%',
                    }}
                >
                    <TransactionGauge />
                </Grid>
            </Grid>
        </ResponsiveLayout>
    );
};

export default System;
