import Validator from '../modules/Validator';
import Transaction from '../modules/Transaction';
import InclusionTime from '../modules/InclusionTime';
import ResponsiveLayout from "../components/ResponsiveLayout";
import Keyper from "../modules/Keyper";
import Grid from '@mui/material/Grid2';

const System = () => {
    return (
        <ResponsiveLayout>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Validator />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Transaction />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Keyper />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <InclusionTime />
                </Grid>
            </Grid>
        </ResponsiveLayout>
    );
};

export default System;
