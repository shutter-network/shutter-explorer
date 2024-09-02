import { Alert, Box, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import BasicTable from "../components/BasicTable";
import ResponsiveLayout from "../layouts/ResponsiveLayout";
import useFetch from "../hooks/useFetch";

const Slot = () => {
    const { data: sequencerTransactionsData, loading: loadingSequencer, error: errorSequencer } = useFetch('/api/transaction/latest_sequencer_transactions');
    const { data: userTransactionsData, loading: loadingUser, error: errorUser } = useFetch('/api/transaction/latest_user_transactions');

    const sequencerColumns = [
        { id: 'hash', label: 'Transaction Hash', minWidth: 170 },
    ];

    const userColumns = [
        { id: 'hash', label: 'Transaction Hash', minWidth: 170 },
        { id: 'status', label: 'Status', minWidth: 100 },
    ];

    return (
        <ResponsiveLayout>
            <Box sx={{ flexGrow: 1, marginTop: 4 }}>
                <Typography variant="h5" align="left">
                    Slot Overview
                </Typography>
                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12 }}>
                        {errorSequencer ? (
                            <Alert severity="error">Error fetching sequencer transactions: {errorSequencer.message}</Alert>
                        ) : (
                            <Box sx={{ marginBottom: 4 }}>
                                <Typography variant="h6">Sequencer Transactions</Typography>
                                {loadingSequencer ? (
                                    <Typography>Loading...</Typography>
                                ) : (
                                    <BasicTable columns={sequencerColumns} rows={sequencerTransactionsData?.transactions || []} />
                                )}
                            </Box>
                        )}
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        {errorUser ? (
                            <Alert severity="error">Error fetching user transactions: {errorUser.message}</Alert>
                        ) : (
                            <Box>
                                <Typography variant="h6">User Transactions</Typography>
                                {loadingUser ? (
                                    <Typography>Loading...</Typography>
                                ) : (
                                    <BasicTable columns={userColumns} rows={userTransactionsData?.transactions || []} />
                                )}
                            </Box>
                        )}
                    </Grid2>
                </Grid2>
            </Box>
        </ResponsiveLayout>
    );
};

export default Slot;
