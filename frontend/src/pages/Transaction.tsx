import { useLocation } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ResponsiveLayout from "../layouts/ResponsiveLayout";
import { FC } from "react";

interface TransactionDetail {
    status: string;
    estimatedInclusionTime: string;
    effectiveInclusionTime: string;
    userTransactionHash: string;
    encryptedTransactionHash: string;
    inclusionSlot: number;
}

const Transaction: FC = () => {
    const location = useLocation();
    const transaction = location.state as TransactionDetail;
    const explorerUrl = process.env.REACT_APP_EXPLORER_URL;

    if (!transaction) {
        return (
            <ResponsiveLayout>
                <Typography variant="h6">No transaction data found.</Typography>
            </ResponsiveLayout>
        );
    }

    return (
        <ResponsiveLayout>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Transaction Details
                </Typography>
                <Grid container spacing={2}>
                    {/* Transaction Status */}
                    <Grid size={4}>
                        <Typography variant="body1" fontWeight="bold">Transaction Status</Typography>
                    </Grid>
                    <Grid size={8}>
                        <Typography variant="body1">{transaction.status}</Typography>
                    </Grid>

                    {/* Estimated Inclusion Time */}
                    <Grid size={4}>
                        <Typography variant="body1" fontWeight="bold">Estimated Inclusion Time</Typography>
                    </Grid>
                    <Grid size={8}>
                        <Typography variant="body1">{transaction.estimatedInclusionTime}</Typography>
                    </Grid>

                    {/* Effective Inclusion Time */}
                    <Grid size={4}>
                        <Typography variant="body1" fontWeight="bold">Effective Inclusion Time</Typography>
                    </Grid>
                    <Grid size={8}>
                        <Typography variant="body1">{transaction.effectiveInclusionTime}</Typography>
                    </Grid>

                    {/* Transaction Hash */}
                    <Grid size={4}>
                        <Typography variant="body1" fontWeight="bold">Transaction</Typography>
                    </Grid>
                    <Grid size={8}>
                        <Link href={`${explorerUrl}/tx/${transaction.userTransactionHash}`} target="_blank" rel="noopener noreferrer">
                            {transaction.userTransactionHash}
                        </Link>
                    </Grid>

                    {/* Sequencer Transaction */}
                    <Grid size={4}>
                        <Typography variant="body1" fontWeight="bold">Sequencer Transaction</Typography>
                    </Grid>
                    <Grid size={8}>
                        <Link href={`${explorerUrl}/tx/${transaction.encryptedTransactionHash}`} target="_blank" rel="noopener noreferrer">
                            {transaction.encryptedTransactionHash}
                        </Link>
                    </Grid>

                    {/* Inclusion Slot */}
                    <Grid size={4}>
                        <Typography variant="body1" fontWeight="bold">Inclusion Slot</Typography>
                    </Grid>
                    <Grid size={8}>
                        <Typography variant="body1">{transaction.inclusionSlot}</Typography>
                    </Grid>
                </Grid>
            </Box>
        </ResponsiveLayout>
    );
};

export default Transaction;
