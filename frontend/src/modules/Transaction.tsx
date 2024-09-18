import { Alert, Box } from '@mui/material';
import InfoBox from '../components/InfoBox';
import OverviewCard from '../components/OverviewCard';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import useFetch from '../hooks/useFetch';
import overviewIcon from '../assets/icons/arrows_horizontal.svg';
import { WebsocketEvent } from '../types/WebsocketEvent';

const Transaction = () => {
    const { data: executedTransactionsData, loading: loadingExecutedTransactions, error: errorExecutedTransactions } = useFetch('/api/transaction/total_executed_transactions');
    const { data: shutterizedTransactionsPerMonthData, loading: loadingShutterizedTransactionsPerMonth, error: errorShutterizedTransactionsPerMonth } = useFetch('/api/transaction/total_transactions_per_month');
    const { data: shutterizedTransactionPercentageData, loading: loadingShutterizedTransactionPercentage, error: errorShutterizedTransactionPercentage } = useFetch('/transaction/shutterized_transaction_percentage');

    const [executedTransactions, setExecutedTransactions] = useState<string | number>(executedTransactionsData?.message || 'N/A');
    const [shutterizedTransactionsPerMonth, setShutterizedTransactionsPerMonth] = useState<string | number>(shutterizedTransactionsPerMonthData?.message || 'N/A');
    const [shutterizedTransactionPercentage, setShutterizedTransactionPercentage] = useState<string | number>(shutterizedTransactionPercentageData?.percentage || 'N/A');
    const [, setWebSocketError] = useState<string | null>(null);

    const { socket } = useWebSocket()!;

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event: MessageEvent) => {
                const websocketEvent = JSON.parse(event.data) as WebsocketEvent;
                if (websocketEvent.Error) {
                    setWebSocketError(`Error: ${websocketEvent.Error.message} (Code: ${websocketEvent.Error.code})`);
                } else if (websocketEvent.Data) {
                    setWebSocketError(null);
                    switch (websocketEvent.Type) {
                        case 'total_executed_transactions_updated':
                            setExecutedTransactions(websocketEvent.Data.count);
                            break;
                        case 'shutterized_transactions_per_month_updated':
                            if ('count' in websocketEvent.Data) {
                                setShutterizedTransactionsPerMonth(websocketEvent.Data.count);
                            }
                            break;
                        case 'shutterized_transaction_percentage_updated':
                            if ('percentage' in websocketEvent.Data) {
                                setShutterizedTransactionPercentage(websocketEvent.Data.percentage);
                            }
                            break;
                        default:
                            console.warn('Unhandled WebSocket event type:', websocketEvent.Type);
                    }
                }
            };

            socket.onerror = () => {
                setWebSocketError('WebSocket error: A connection error occurred');
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
        if (shutterizedTransactionsPerMonthData?.message) setShutterizedTransactionsPerMonth(shutterizedTransactionsPerMonthData.message[0].TotalTxs);
        if (shutterizedTransactionPercentageData?.percentage) setShutterizedTransactionPercentage(shutterizedTransactionPercentageData.percentage);
    }, [executedTransactionsData, shutterizedTransactionsPerMonthData, shutterizedTransactionPercentageData]);

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
                    <OverviewCard title="Transaction Overview" iconSrc={overviewIcon}>
                        {errorExecutedTransactions ? (
                            <Alert severity="error">Error fetching Executed Transactions: {errorExecutedTransactions.message}</Alert>
                        ) : (
                            <InfoBox
                                title="# Successfully Executed Transactions"
                                tooltip="Total number of successfully executed transactions"
                                value={loadingExecutedTransactions ? 'Loading...' : executedTransactions}
                            />
                        )}
                        {errorShutterizedTransactionsPerMonth ? (
                            <Alert severity="error">Error fetching Shutterized Transactions per Month: {errorShutterizedTransactionsPerMonth.message}</Alert>
                        ) : (
                            <InfoBox
                                title="# Shutterized Transactions per Month"
                                tooltip="Number of Shutterized transactions executed in the last month"
                                value={loadingShutterizedTransactionsPerMonth ? 'Loading...' : shutterizedTransactionsPerMonth}
                            />
                        )}
                        {errorShutterizedTransactionPercentage ? (
                            <Alert severity="error">Error fetching Shutterized Transaction Percentage: {errorShutterizedTransactionPercentage.message}</Alert>
                        ) : (
                            <InfoBox
                                title="Percentage of Shutterized Transactions"
                                tooltip="Percentage of transactions that are Shutterized"
                                value={loadingShutterizedTransactionPercentage ? 'Loading...' : `${shutterizedTransactionPercentage}%`}
                            />
                        )}
                    </OverviewCard>
        </Box>
    );
};

export default Transaction;
