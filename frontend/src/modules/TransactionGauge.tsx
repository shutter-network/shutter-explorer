import { Alert, Box } from '@mui/material';
import OverviewCard from '../components/OverviewCard';
import BasicGauges from '../components/Gauge';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import useFetch from '../hooks/useFetch';

const TransactionGauge = () => {
    const { data: transactionStatsData, loading: loadingTransactionStats, error: errorTransactionStats } = useFetch('/api/inclusion_time/executed_transactions');
    const [successfulTransactions, setSuccessfulTransactions] = useState<number>(transactionStatsData?.message?.Shielded || 0);
    const [failedTransactions, setFailedTransactions] = useState<number>(transactionStatsData?.message?.Unshielded || 0);
    const [, setWebSocketError] = useState<string | null>(null);

    const { socket } = useWebSocket()!;

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event: MessageEvent) => {
                const websocketEvent = JSON.parse(event.data);
                if (websocketEvent.error) {
                    setWebSocketError(`Error: ${websocketEvent.error.message} (Code: ${websocketEvent.error.code})`);
                } else if (websocketEvent.data) {
                    setWebSocketError(null);
                    if (websocketEvent.type === 'executed_transactions_updated') {
                        if ('Shielded' in websocketEvent.data.message && 'Unshielded' in websocketEvent.data.message) {
                            setSuccessfulTransactions(websocketEvent.data.message.Shielded);
                            setFailedTransactions(websocketEvent.data.message.Unshielded);
                        }
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
        if (transactionStatsData?.message?.Shielded) setSuccessfulTransactions(transactionStatsData.message.Shielded);
        if (transactionStatsData?.message?.Unshielded) setFailedTransactions(transactionStatsData.message.Unshielded);
    }, [transactionStatsData]);

    const totalTransactions = successfulTransactions + failedTransactions
    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <OverviewCard title="Shielded Transactions" centerTitle updIcon={false}>
                {errorTransactionStats ? (
                    <Alert severity="error">Error fetching Transaction Stats: {errorTransactionStats.message}</Alert>
                ) : (
                    <BasicGauges
                        success={loadingTransactionStats ? 0 : successfulTransactions}
                        total={loadingTransactionStats ? 0 : totalTransactions}
                        failed={loadingTransactionStats ? 0 : failedTransactions}
                    />
                )}
            </OverviewCard>
        </Box>
    );
};

export default TransactionGauge;