import { Alert, Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import InfoBox from '../components/InfoBox';
import BasicGauges from '../components/Gauge';
import CustomLineChart from '../components/CustomLineChart';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { WebsocketEvent } from '../types/WebsocketEvent';
import useFetch from '../hooks/useFetch';

const InclusionTime = () => {
    const { data: estimatedInclusionTimeData, loading: loadingEstimatedInclusionTime, error: errorEstimatedInclusionTime } = useFetch('/api/inclusion_time/estimated_inclusion_time');
    const { data: transactionStatsData, loading: loadingTransactionStats, error: errorTransactionStats } = useFetch('/api/inclusion_time/executed_transactions');
    const { data: historicalInclusionTimeData, loading: loadingHistoricalInclusionTime, error: errorHistoricalInclusionTime } = useFetch('/api/inclusion_time/historical_inclusion_time');

    const [estimatedInclusionTime, setEstimatedInclusionTime] = useState<string | number>(estimatedInclusionTimeData?.message || 'N/A');
    const [successfulTransactions, setSuccessfulTransactions] = useState<number>(transactionStatsData?.message?.Successful || 0);
    const [failedTransactions, setFailedTransactions] = useState<number>(transactionStatsData?.message?.Failed || 0);
    const [historicalInclusionTime, setHistoricalInclusionTime] = useState(historicalInclusionTimeData?.message || []);
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
                        case 'estimated_inclusion_time_updated':
                            if ('time' in websocketEvent.data) {
                                setEstimatedInclusionTime(websocketEvent.data.time);
                            }
                            break;
                        case 'executed_transactions_updated':
                            if ('successful' in websocketEvent.data && 'failed' in websocketEvent.data) {
                                setSuccessfulTransactions(websocketEvent.data.successful);
                                setFailedTransactions(websocketEvent.data.failed);
                            }
                            break;
                        case 'historical_inclusion_time_updated':
                            if ('times' in websocketEvent.data) {
                                setHistoricalInclusionTime(websocketEvent.data.times);
                            }
                            break;
                        default:
                            console.warn('Unhandled WebSocket event type:', websocketEvent.type);
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
        if (transactionStatsData?.message?.Successful) setSuccessfulTransactions(transactionStatsData.message?.Successful);
        if (transactionStatsData?.Failed) setFailedTransactions(transactionStatsData.Failed);
        if (historicalInclusionTimeData?.message) setHistoricalInclusionTime(historicalInclusionTimeData.message);
    }, [estimatedInclusionTimeData, transactionStatsData, historicalInclusionTimeData]);

    const totalTransactions = successfulTransactions + failedTransactions;
    const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <Typography variant="h5" align="left">
                Inclusion Time Overview
            </Typography>
            {webSocketError && <Alert severity="error">{webSocketError}</Alert>}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    {errorEstimatedInclusionTime ? (
                        <Alert severity="error">Error fetching Estimated Inclusion Time: {errorEstimatedInclusionTime.message}</Alert>
                    ) : (
                        <InfoBox
                            title="Estimated Inclusion Time"
                            tooltip="Average inclusion time for a shutterized block"
                            value={loadingEstimatedInclusionTime ? 'Loading...' : `${estimatedInclusionTime} mins`}
                        />
                    )}
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ marginTop: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    {errorTransactionStats ? (
                        <Alert severity="error">Error fetching Transaction Stats: {errorTransactionStats.message}</Alert>
                    ) : (
                        <Box sx={{ padding: 2 }}>
                            <BasicGauges title="Transaction Success Rate" value={loadingTransactionStats ? 0 : successRate} />
                        </Box>
                    )}
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    {errorHistoricalInclusionTime ? (
                        <Alert severity="error">Error fetching Historical Inclusion Times: {errorHistoricalInclusionTime.message}</Alert>
                    ) : (
                        <CustomLineChart
                            data={loadingHistoricalInclusionTime ? [] : historicalInclusionTime}
                            title={loadingHistoricalInclusionTime ? 'Loading Historical Inclusion Times...' : 'Historical Inclusion Times'}
                        />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default InclusionTime;
