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
    const { data: totalTransactionsPerMonthData, loading: loadingTotalTransactionsPerMonth, error: errorTotalTransactionsPerMonth } = useFetch('/api/transaction/total_transactions_per_month');
    const { data: transactionPercentageData, loading: loadingTransactionPercentage, error: errorTransactionPercentage } = useFetch('/api/transaction/transaction_percentage');

    const [executedTransactions, setExecutedTransactions] = useState<number | null>(null);
    const [transactionsPerMonth, setTransactionsPerMonth] = useState<number | null>(null);
    const [transactionPercentage, setTransactionPercentage] = useState<number | null>(null);
    const [, setWebSocketError] = useState<string | null>(null);

    const { socket } = useWebSocket()!;

    useEffect(() => {
        if (socket) {
            const handleMessage = (event: MessageEvent) => {
                const websocketEvent = JSON.parse(event.data) as WebsocketEvent;

                if (websocketEvent.Error) {
                    setWebSocketError(`Error: ${websocketEvent.Error.message} (Code: ${websocketEvent.Error.code})`);
                } else if (websocketEvent.Data) {
                    setWebSocketError(null);
                    switch (websocketEvent.Type) {
                        case 'total_executed_transactions_updated':
                            if (typeof websocketEvent.Data === 'number') {
                                setExecutedTransactions(websocketEvent.Data);
                            } else {
                                console.warn('Unexpected data type for total_executed_transactions_updated');
                            }
                            break;
                        case 'transactions_per_month_updated':
                            if ('count' in websocketEvent.Data && typeof websocketEvent.Data.count === 'number') {
                                setTransactionsPerMonth(websocketEvent.Data.count);
                            } else {
                                console.warn('Unexpected data structure for transactions_per_month_updated');
                            }
                            break;
                        case 'transaction_percentage_updated':
                            if (typeof websocketEvent.Data === 'number') {
                                setTransactionPercentage(websocketEvent.Data);
                            } else {
                                console.warn('Unexpected data type for transaction_percentage_updated');
                            }
                            break;
                        default:
                            console.warn('Unhandled WebSocket event type:', websocketEvent.Type);
                    }
                }
            };

            const handleError = () => {
                setWebSocketError('WebSocket error: A connection error occurred');
            };

            socket.addEventListener('message', handleMessage);
            socket.addEventListener('error', handleError);

            return () => {
                socket.removeEventListener('message', handleMessage);
                socket.removeEventListener('error', handleError);
            };
        }
    }, [socket]);

    useEffect(() => {
        if (executedTransactionsData && executedTransactionsData.message !== undefined) {
            setExecutedTransactions(Number(executedTransactionsData.message));
        }

        if (totalTransactionsPerMonthData && totalTransactionsPerMonthData.message) {
            setTransactionsPerMonth(Number(totalTransactionsPerMonthData.message));
        }

        if (transactionPercentageData && transactionPercentageData.message !== undefined) {
            setTransactionPercentage(Number(transactionPercentageData.message));
        }
    }, [executedTransactionsData, totalTransactionsPerMonthData, transactionPercentageData]);

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <OverviewCard title="Transaction Overview" iconSrc={overviewIcon}>
                {errorExecutedTransactions ? (
                    <Alert severity="error">Error fetching Executed Transactions: {errorExecutedTransactions.message}</Alert>
                ) : (
                    <InfoBox
                        title="# Successfully Shielded Transactions"
                        tooltip="Total number of successfully shielded transactions"
                        value={loadingExecutedTransactions || executedTransactions === null ? 'Loading...' : executedTransactions}
                    />
                )}
                {errorTotalTransactionsPerMonth ? (
                    <Alert severity="error">Error fetching Transactions per Month: {errorTotalTransactionsPerMonth.message}</Alert>
                ) : (
                    <InfoBox
                        title="# Shielded Transactions per Month"
                        tooltip="Number of shielded transactions in the last 30 days"
                        value={loadingTotalTransactionsPerMonth || transactionsPerMonth === null ? 'Loading...' : transactionsPerMonth}
                    />
                )}
                {errorTransactionPercentage ? (
                    <Alert severity="error">Error fetching Transaction Percentage: {errorTransactionPercentage.message}</Alert>
                ) : (
                    <InfoBox
                        title="Percentage of Shielded Transactions"
                        tooltip="Percentage of monthly shielded transactions amongst monthly Gnosis transactions"
                        value={loadingTransactionPercentage || transactionPercentage === null ? 'Loading...' : `${(transactionPercentage * 100).toFixed(2)}%`}
                    />
                )}
            </OverviewCard>
        </Box>
    );
};

export default Transaction;
