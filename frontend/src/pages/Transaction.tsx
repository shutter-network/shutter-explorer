import { useLocation } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ResponsiveLayout from "../components/ResponsiveLayout";
import { FC, useState, useEffect } from "react";
import useFetchWithPolling from '../hooks/useFetchWithPolling';
import { StyledTransactionDetails } from '../styles/transactionDetail';

interface TransactionDetails {
    status: string;
    estimatedInclusionTime: string;
    effectiveInclusionTime: string;
    userTransactionHash: string;
    sequencerTransactionHash: string;
    inclusionSlot: number;
}

const Transaction: FC = () => {
    const location = useLocation();
    const initialTransaction = location.state as TransactionDetails | undefined;
    const explorerUrl = process.env.REACT_APP_EXPLORER_URL;

    const [transaction, setTransaction] = useState<TransactionDetails | null>(initialTransaction || null);

    const { data: updatedData, loading, error } = useFetchWithPolling(
        initialTransaction ? `/api/transaction/${initialTransaction.userTransactionHash}` : '',
        10000
    );

    useEffect(() => {
        if (updatedData) {
            setTransaction(updatedData as TransactionDetails);
        }
    }, [updatedData]);

    if (!transaction) {
        return (
            <ResponsiveLayout>
                <Typography variant="h6">No transaction data found.</Typography>
            </ResponsiveLayout>
        );
    }

    return (
        <ResponsiveLayout>
            <StyledTransactionDetails>
                <Typography variant="h4" gutterBottom>
                    Transaction Details
                </Typography>
                <Grid container spacing={2}>
                    {/* Transaction Status */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body1" fontWeight="bold" className="card-label">Transaction Status</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Typography variant="body1" className="status-pending">{transaction.status}</Typography>
                    </Grid>

                    {/* Estimated Inclusion Time */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body1" fontWeight="bold" className="card-label">Estimated Inclusion Time</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Typography variant="body1" className="card-value">{transaction.estimatedInclusionTime}</Typography>
                    </Grid>

                    {/* Effective Inclusion Time */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body1" fontWeight="bold" className="card-label">Effective Inclusion Time</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Typography variant="body1" className="card-value">{transaction.effectiveInclusionTime}</Typography>
                    </Grid>

                    {/* Transaction Hash */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body1" fontWeight="bold" className="card-label">Transaction</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Link href={`${explorerUrl}/tx/${transaction.userTransactionHash}`} target="_blank" rel="noopener noreferrer" className="hash">
                            {transaction.userTransactionHash}
                        </Link>
                    </Grid>

                    {/* Sequencer Transaction */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body1" fontWeight="bold" className="card-label">Sequencer Transaction</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Link href={`${explorerUrl}/tx/${transaction.sequencerTransactionHash}`} target="_blank" rel="noopener noreferrer" className="hash">
                            {transaction.sequencerTransactionHash}
                        </Link>
                    </Grid>

                    {/* Inclusion Slot */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body1" fontWeight="bold" className="card-label">Inclusion Slot</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Typography variant="body1" className="card-value">{transaction.inclusionSlot}</Typography>
                    </Grid>
                </Grid>

                {error && (
                    <Typography variant="body2" color="error">
                        Error fetching latest data, displaying last known data.
                    </Typography>
                )}
                {loading && (
                    <Typography variant="body2" color="textSecondary">
                        Fetching latest data...
                    </Typography>
                )}
            </StyledTransactionDetails>
        </ResponsiveLayout>
    );
};

export default Transaction;
