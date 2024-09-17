import { useLocation } from 'react-router-dom';
import { Typography, Link, Divider, Box, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ResponsiveLayout from "../components/ResponsiveLayout";
import { FC, useState, useEffect } from "react";
import useFetchWithPolling from '../hooks/useFetchWithPolling';
import { StyledTransactionDetails } from '../styles/transactionDetail';
import TitleSection from "../components/TitleSection";
import { formatSeconds, formatTimestamp } from '../utils/utils';
import { ReactComponent as InfoIcon } from '../assets/icons/info.svg';

interface TransactionDetails {
    TxStatus: string;
    EstimatedInclusionTime: number;
    EffectiveInclusionTime: number;
    UserTxHash: string;
    SequencerTxHash: string;
    InclusionSlot: number;
    Sender: string
}

const Transaction: FC = () => {
    const location = useLocation();
    const initialTransaction = location.state as TransactionDetails | undefined;
    const explorerUrl = process.env.REACT_APP_EXPLORER_URL;

    const [transaction, setTransaction] = useState<TransactionDetails | null>(initialTransaction || null);

    const { data: updatedData, loading, error } = useFetchWithPolling(
        initialTransaction ? `/api/transaction/${initialTransaction.UserTxHash}` : '',
        10000
    );

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
                <TitleSection title="Transaction Details" />
                <Grid container spacing={2} sx={{ marginTop: 4 }}>
                    {/* Transaction Hash */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1" fontWeight="bold" className="card-label" textAlign="left">
                                Transaction Hash
                            </Typography>
                            <Tooltip title="User transaction hash">
                                <InfoIcon />
                            </Tooltip>
                        </Box>

                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Link href={`${explorerUrl}/tx/${transaction.UserTxHash}`} target="_blank" rel="noopener noreferrer" className="hash">
                            {transaction.UserTxHash}
                        </Link>
                    </Grid>

                    {/* Sequencer Transaction */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1" fontWeight="bold" className="card-label" textAlign="left">Sequencer Transaction</Typography>
                            <Tooltip title="Transaction hash submitted to sequencer contract">
                                <InfoIcon />
                            </Tooltip>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Link href={`${explorerUrl}/tx/${transaction.SequencerTxHash}`} target="_blank" rel="noopener noreferrer" className="hash">
                            {transaction.SequencerTxHash}
                        </Link>
                    </Grid>


                    {/* Inclusion Slot */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1" fontWeight="bold" className="card-label" textAlign="left">Inclusion Slot</Typography>
                            <Tooltip title="Slot in which the transaction was included in">
                                <InfoIcon />
                            </Tooltip>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Typography variant="body1" className="card-value">{transaction.InclusionSlot}</Typography>
                    </Grid>

                    <Grid size={{ lg: 12 }}>
                        <Divider></Divider>
                    </Grid>

                    {
                        transaction.EffectiveInclusionTime === 0 ?
                            /* Estimated Inclusion Time */
                            <>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="body1" fontWeight="bold" className="card-label" textAlign="left">Estimated Inclusion Time</Typography>
                                        <Tooltip title="Time in which transaction will be included in">
                                            <InfoIcon />
                                        </Tooltip>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <Typography variant="body1" className="card-value">{formatSeconds(transaction.EstimatedInclusionTime)}</Typography>
                                </Grid>
                            </> :
                            /* Effective Inclusion Time */
                            <>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="body1" fontWeight="bold" className="card-label" textAlign="left">Effective Inclusion Time</Typography>
                                        <Tooltip title="Time in which transaction was included in">
                                            <InfoIcon />
                                        </Tooltip>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <Typography variant="body1" className="card-value">{formatTimestamp(transaction.EffectiveInclusionTime)}</Typography>
                                </Grid>

                                <Grid size={{ lg: 12 }}>
                                    <Divider></Divider>
                                </Grid>
                            </>
                    }

                    {/* Transaction Status */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body1" fontWeight="bold" className="card-label" textAlign="left">Transaction Status</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Typography variant="body1" className={transaction.TxStatus === "Completed" ? "status-completed" : "status-pending"}>{transaction.TxStatus}</Typography>
                    </Grid>

                    <Grid size={{ lg: 12 }}>
                        <Divider></Divider>
                    </Grid>

                    {/* From */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1" fontWeight="bold" className="card-label" textAlign="left">From</Typography>
                            <Tooltip title="Transaction submitted by">
                                <InfoIcon />
                            </Tooltip>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Link href={`${explorerUrl}/address/${transaction.Sender}`} target="_blank" rel="noopener noreferrer" className="hash">
                            {transaction.Sender}
                        </Link>
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
