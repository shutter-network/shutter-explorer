import { Alert, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import OverviewCard from '../components/OverviewCard';
import BasicGauges from '../components/Gauge';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import useFetch from '../hooks/useFetch';
import { useTheme } from '@mui/material/styles';

const TransactionGauge = () => {
    const theme = useTheme();

    const { data: transactionStatsData, loading: loadingTransactionStats, error: errorTransactionStats } = useFetch('/inclusion_time/executed_transactions');

    const [successfulTransactions, setSuccessfulTransactions] = useState<number>(transactionStatsData?.successful || 0);
    const [failedTransactions, setFailedTransactions] = useState<number>(transactionStatsData?.failed || 0);
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
                        if ('successful' in websocketEvent.data && 'failed' in websocketEvent.data) {
                            setSuccessfulTransactions(websocketEvent.data.successful);
                            setFailedTransactions(websocketEvent.data.failed);
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
        if (transactionStatsData?.successful) setSuccessfulTransactions(transactionStatsData.successful);
        if (transactionStatsData?.failed) setFailedTransactions(transactionStatsData.failed);
    }, [transactionStatsData]);

    const totalTransactions = successfulTransactions + failedTransactions;
    const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <OverviewCard title="Executed Transactions">
                        {errorTransactionStats ? (
                            <Alert severity="error">Error fetching Transaction Stats: {errorTransactionStats.message}</Alert>
                        ) : (
                            <BasicGauges
                                value={loadingTransactionStats ? 0 : successRate}
                                title=""
                                gaugeColor={theme.palette.primary.main}
                                labelColor={theme.palette.text.primary}
                            />
                        )}
                    </OverviewCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TransactionGauge;
