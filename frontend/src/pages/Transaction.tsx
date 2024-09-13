import { useLocation } from 'react-router-dom';
import { Typography, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ResponsiveLayout from "../components/ResponsiveLayout";
import { FC, useState, useEffect } from "react";
import useFetchWithPolling from '../hooks/useFetchWithPolling';
import { StyledTransactionDetails } from '../styles/transactionDetail';

interface TransactionDetails {
    TxStatus: string;
    EstimatedInclusionTime: string;
    EffectiveInclusionTime: string;
    UserTxHash: string;
    SequencerTxHash: string;
    InclusionSlot: number;
}

const Transaction: FC = () => {
    const location = useLocation();
    const initialTransaction = location.state.message as TransactionDetails | undefined;
    const explorerUrl = process.env.REACT_APP_EXPLORER_URL;

    const [transaction, setTransaction] = useState<TransactionDetails | null>(initialTransaction || null);

    const { data: updatedData, loading, error } = useFetchWithPolling(
        initialTransaction ? `/api/transaction/${initialTransaction.UserTxHash}` : '',
        10000
    );

    console.log(error, "error")

    useEffect(() => {
        if (updatedData) {
            setTransaction(updatedData.message as TransactionDetails);
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
                        <Typography variant="body1" className="status-pending">{transaction.TxStatus}</Typography>
                    </Grid>

                    {/* Estimated Inclusion Time */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body1" fontWeight="bold" className="card-label">Estimated Inclusion Time</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Typography variant="body1" className="card-value">{transaction.EstimatedInclusionTime}</Typography>
                    </Grid>

                    {/* Effective Inclusion Time */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body1" fontWeight="bold" className="card-label">Effective Inclusion Time</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Typography variant="body1" className="card-value">{transaction.EffectiveInclusionTime}</Typography>
                    </Grid>

                    {/* Transaction Hash */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body1" fontWeight="bold" className="card-label">Transaction</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Link href={`${explorerUrl}/tx/${transaction.UserTxHash}`} target="_blank" rel="noopener noreferrer" className="hash">
                            {transaction.UserTxHash}
                        </Link>
                    </Grid>

                    {/* Sequencer Transaction */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body1" fontWeight="bold" className="card-label">Sequencer Transaction</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Link href={`${explorerUrl}/tx/${transaction.SequencerTxHash}`} target="_blank" rel="noopener noreferrer" className="hash">
                            {transaction.SequencerTxHash}
                        </Link>
                    </Grid>

                    {/* Inclusion Slot */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body1" fontWeight="bold" className="card-label">Inclusion Slot</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Typography variant="body1" className="card-value">{transaction.InclusionSlot}</Typography>
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
