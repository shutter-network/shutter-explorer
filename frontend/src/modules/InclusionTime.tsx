import { Alert, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import OverviewCard from '../components/OverviewCard';
import CustomLineChart from '../components/CustomLineChart';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import useFetch from '../hooks/useFetch';

const InclusionTime = () => {
    const { data: estimatedInclusionTimeData,} = useFetch('/api/inclusion_time/estimated_inclusion_time');
    const { data: transactionStatsData, } = useFetch('/api/inclusion_time/executed_transactions');
    const { data: historicalInclusionTimeData, loading: loadingHistoricalInclusionTime, error: errorHistoricalInclusionTime } = useFetch('/api/inclusion_time/historical_inclusion_time');

    const [, setEstimatedInclusionTime] = useState<string | number>(estimatedInclusionTimeData?.message || 'N/A');
    const [successfulTransactions, setSuccessfulTransactions] = useState<number>(transactionStatsData?.message?.Successful || 0);
    const [failedTransactions, setFailedTransactions] = useState<number>(transactionStatsData?.message?.Failed || 0);
    const [historicalInclusionTime, setHistoricalInclusionTime] = useState(historicalInclusionTimeData?.message || []);
    const [webSocketError, setWebSocketError] = useState<string | null>(null);

    const { socket } = useWebSocket()!;

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event: MessageEvent) => {
                const websocketEvent = JSON.parse(event.data);
                if (websocketEvent.error) {
                    setWebSocketError(`Error: ${websocketEvent.error.message} (Code: ${websocketEvent.error.code})`);
                } else if (websocketEvent.data) {
                    setWebSocketError(null);
                    if (websocketEvent.type === 'historical_inclusion_time_updated' && 'times' in websocketEvent.data) {
                        setHistoricalInclusionTime(websocketEvent.data.times);
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
        if (estimatedInclusionTimeData?.message) setEstimatedInclusionTime(estimatedInclusionTimeData.message);
        if (transactionStatsData?.message?.Successful) setSuccessfulTransactions(transactionStatsData.message.Successful);
        if (transactionStatsData?.message?.Failed) setFailedTransactions(transactionStatsData.message.Failed);
        if (historicalInclusionTimeData?.message) setHistoricalInclusionTime(historicalInclusionTimeData.message);
    }, [estimatedInclusionTimeData, transactionStatsData, historicalInclusionTimeData]);

    const totalTransactions = successfulTransactions + failedTransactions;
    const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            {webSocketError && <Alert severity="error">{webSocketError}</Alert>}

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <OverviewCard title="Historical Inclusion Time">
                        {errorHistoricalInclusionTime ? (
                            <Alert severity="error">Error fetching Historical Inclusion Times: {errorHistoricalInclusionTime.message}</Alert>
                        ) : (
                            <CustomLineChart
                                data={loadingHistoricalInclusionTime ? [] : historicalInclusionTime}
                                title={loadingHistoricalInclusionTime ? 'Loading Historical Inclusion Times...' : ''}
                            />
                        )}
                    </OverviewCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default InclusionTime;
