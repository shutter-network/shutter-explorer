import { Alert, Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import InfoBox from '../components/InfoBox';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { WebsocketEvent } from '../types/WebsocketEvent';
import useFetch from '../hooks/useFetch';

const Transaction = () => {
    const { data: executedTransactionsData, loading: loadingExecutedTransactions, error: errorExecutedTransactions } = useFetch('/api/transaction/total_executed_transactions');
    const { data: shutterizedTransactionsPerMonthData, loading: loadingShutterizedTransactionsPerMonth, error: errorShutterizedTransactionsPerMonth } = useFetch('/api/transaction/total_transactions_per_month');
    const { data: shutterizedTransactionPercentageData, loading: loadingShutterizedTransactionPercentage, error: errorShutterizedTransactionPercentage } = useFetch('/transaction/shutterized_transaction_percentage');

    const [executedTransactions, setExecutedTransactions] = useState<string | number>(executedTransactionsData?.message || 'N/A');
    const [shutterizedTransactionsPerMonth, setShutterizedTransactionsPerMonth] = useState<string | number>(shutterizedTransactionsPerMonthData?.message || 'N/A');
    const [shutterizedTransactionPercentage, setShutterizedTransactionPercentage] = useState<string | number>(shutterizedTransactionPercentageData?.percentage || 'N/A');
    const [webSocketError, setWebSocketError] = useState<string | null>(null);

    const { socket } = useWebSocket()!;

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event: MessageEvent) => {
                const websocketEvent = JSON.parse(event.data) as WebsocketEvent;

                if (websocketEvent.error) {
                    setWebSocketError(`Error: ${websocketEvent.error.message} (Code: ${websocketEvent.error.code})`);
                } else if (websocketEvent.data) {
                    setWebSocketError(null);
                    switch (websocketEvent.type) {
                        case 'executed_transactions_updated':
                            if ('count' in websocketEvent.data) {
                                setExecutedTransactions(websocketEvent.data.count);
                            } else {
                                console.warn('Invalid data format for executed_transactions_updated');
                            }
                            break;
                        case 'shutterized_transactions_per_month_updated':
                            if ('count' in websocketEvent.data) {
                                setShutterizedTransactionsPerMonth(websocketEvent.data.count);
                            } else {
                                console.warn('Invalid data format for shutterized_transactions_per_month_updated');
                            }
                            break;
                        case 'shutterized_transaction_percentage_updated':
                            if ('percentage' in websocketEvent.data) {
                                setShutterizedTransactionPercentage(websocketEvent.data.percentage);
                            } else {
                                console.warn('Invalid data format for shutterized_transaction_percentage_updated');
                            }
                            break;
                        default:
                            console.warn('Unhandled WebSocket event type:', websocketEvent.type);
                    }
                } else {
                    setWebSocketError(`Received null data for event type: ${websocketEvent.type}`);
                    console.warn('Received null data for event type:', websocketEvent.type);
                }
            };

            socket.onerror = () => {
                setWebSocketError('WebSocket error: A connection error occurred');
                console.error('WebSocket error: A connection error occurred');
            };
        }

        return () => {
            if (socket) {
                socket.onmessage = null;
                socket.onerror = null;
            }
        };
    }, [socket]);

    useEffect(() => {
        if (executedTransactionsData?.message) setExecutedTransactions(executedTransactionsData.message);
        if (shutterizedTransactionsPerMonthData?.message) setShutterizedTransactionsPerMonth(shutterizedTransactionsPerMonthData.message);
        if (shutterizedTransactionPercentageData?.percentage) setShutterizedTransactionPercentage(shutterizedTransactionPercentageData.percentage);
    }, [executedTransactionsData, shutterizedTransactionsPerMonthData, shutterizedTransactionPercentageData]);

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <Typography variant="h5" align="left">
                Transaction Overview
            </Typography>
            {webSocketError && <Alert severity="error">{webSocketError}</Alert>}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    {errorExecutedTransactions ? (
                        <Alert severity="error">Error fetching Executed Transactions: {errorExecutedTransactions.message}</Alert>
                    ) : (
                        <InfoBox
                            title="# Successfully Executed Transactions"
                            tooltip="Total number of successfully executed transactions"
                            value={loadingExecutedTransactions ? 'Loading...' : executedTransactions}
                        />
                    )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    {errorShutterizedTransactionsPerMonth ? (
                        <Alert severity="error">Error fetching Shutterized Transactions per Month: {errorShutterizedTransactionsPerMonth.message}</Alert>
                    ) : (
                        <InfoBox
                            title="# Shutterized Transactions per Month"
                            tooltip="Number of Shutterized transactions executed in the last month"
                            value={loadingShutterizedTransactionsPerMonth ? 'Loading...' : shutterizedTransactionsPerMonth}
                        />
                    )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    {errorShutterizedTransactionPercentage ? (
                        <Alert severity="error">Error fetching Shutterized Transaction Percentage: {errorShutterizedTransactionPercentage.message}</Alert>
                    ) : (
                        <InfoBox
                            title="Percentage of Shutterized Transactions"
                            tooltip="Percentage of transactions that are Shutterized"
                            value={loadingShutterizedTransactionPercentage ? 'Loading...' : `${shutterizedTransactionPercentage}%`}
                        />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Transaction;
