import { Alert, Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import InfoBox from '../components/InfoBox';
import OverviewCard from '../components/OverviewCard';
import CustomLineChart from '../components/CustomLineChart';
import BasicGauges from '../components/Gauge';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import useFetch from '../hooks/useFetch';

const InclusionTime = () => {
    const { data: estimatedInclusionTimeData, loading: loadingEstimatedInclusionTime, error: errorEstimatedInclusionTime } = useFetch('/inclusion-time/estimated_inclusion_time');
    const { data: transactionStatsData, loading: loadingTransactionStats, error: errorTransactionStats } = useFetch('/inclusion-time/executed_transactions');
    const { data: historicalInclusionTimeData, loading: loadingHistoricalInclusionTime, error: errorHistoricalInclusionTime } = useFetch('/inclusion-time/historical_inclusion_time');

    const [estimatedInclusionTime, setEstimatedInclusionTime] = useState<string | number>(estimatedInclusionTimeData?.inclusionTime || 'N/A');
    const [successfulTransactions, setSuccessfulTransactions] = useState<number>(transactionStatsData?.successful || 0);
    const [failedTransactions, setFailedTransactions] = useState<number>(transactionStatsData?.failed || 0);
    const [historicalInclusionTime, setHistoricalInclusionTime] = useState(historicalInclusionTimeData?.times || []);
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
        if (estimatedInclusionTimeData?.inclusionTime) setEstimatedInclusionTime(estimatedInclusionTimeData.inclusionTime);
        if (transactionStatsData?.successful) setSuccessfulTransactions(transactionStatsData.successful);
        if (transactionStatsData?.failed) setFailedTransactions(transactionStatsData.failed);
        if (historicalInclusionTimeData?.times) setHistoricalInclusionTime(historicalInclusionTimeData.times);
    }, [estimatedInclusionTimeData, transactionStatsData, historicalInclusionTimeData]);

    const totalTransactions = successfulTransactions + failedTransactions;
    const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            {webSocketError && <Alert severity="error">{webSocketError}</Alert>}

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <OverviewCard title="Inclusion Time Overview" iconSrc="">
                        {errorEstimatedInclusionTime ? (
                            <Alert severity="error">Error fetching Estimated Inclusion Time: {errorEstimatedInclusionTime.message}</Alert>
                        ) : (
                            <InfoBox
                                title="Estimated Inclusion Time"
                                tooltip="Average inclusion time for a shutterized block"
                                value={loadingEstimatedInclusionTime ? 'Loading...' : `${estimatedInclusionTime} mins`}
                            />
                        )}

                        {errorTransactionStats ? (
                            <Alert severity="error">Error fetching Transaction Stats: {errorTransactionStats.message}</Alert>
                        ) : (
                            <Box sx={{ padding: 2 }}>
                                <BasicGauges title="Transaction Success Rate" value={loadingTransactionStats ? 0 : successRate} />
                            </Box>
                        )}

                        {errorHistoricalInclusionTime ? (
                            <Alert severity="error">Error fetching Historical Inclusion Times: {errorHistoricalInclusionTime.message}</Alert>
                        ) : (
                            <CustomLineChart
                                data={loadingHistoricalInclusionTime ? [] : historicalInclusionTime}
                                title={loadingHistoricalInclusionTime ? 'Loading Historical Inclusion Times...' : 'Historical Inclusion Times'}
                            />
                        )}
                    </OverviewCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default InclusionTime;
