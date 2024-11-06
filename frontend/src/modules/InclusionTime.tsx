import { Alert, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import OverviewCard from '../components/OverviewCard';
import CustomLineChart from '../components/CustomLineChart';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import useFetch from '../hooks/useFetch';
import { HistoricalInclusionTimeResponse, WebsocketEvent } from '../types/WebsocketEvent';

const InclusionTime = () => {
    const { data: estimatedInclusionTimeData, loading: loadingEstimatedInclusionTime, error: errorEstimatedInclusionTime } = useFetch('/api/inclusion_time/estimated_inclusion_time');
    const { data: historicalInclusionTimeData, loading: loadingHistoricalInclusionTime, error: errorHistoricalInclusionTime } = useFetch('/api/inclusion_time/historical_inclusion_time');

    const [historicalInclusionTime, setHistoricalInclusionTime] = useState(historicalInclusionTimeData?.message || []);
    const [estimatedInclusionTime, setEstimatedInclusionTime] = useState(estimatedInclusionTimeData?.message || []);
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
                    if (websocketEvent.Type === 'historical_inclusion_time_updated' && 'times' in websocketEvent.Data) {
                        setHistoricalInclusionTime(websocketEvent.Data.times);
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
        if (historicalInclusionTimeData?.message) setHistoricalInclusionTime(historicalInclusionTimeData.message);
        if (estimatedInclusionTimeData?.message) setEstimatedInclusionTime(estimatedInclusionTimeData.message);
    }, [historicalInclusionTimeData, estimatedInclusionTimeData]);

    const historicalTrasactionData = historicalInclusionTime.map((data: HistoricalInclusionTimeResponse) => ({
        day: data.SubmissionDateUnix,
        averageInclusionTime: data.AvgInclusionTimeSeconds,
    }));

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <OverviewCard title="Historical Inclusion Time" updIcon={false}>
                        {errorHistoricalInclusionTime ? (
                            <Alert severity="error">Error fetching Historical Inclusion Times: {errorHistoricalInclusionTime.message}</Alert>
                        ) : ( errorEstimatedInclusionTime ? 
                            <Alert severity="error">Error fetching Estimated Inclusion Times: {errorEstimatedInclusionTime.message}</Alert>:
                        (
                            <CustomLineChart
                                data={loadingHistoricalInclusionTime ? [] : historicalTrasactionData}
                                title={loadingHistoricalInclusionTime ? 'Loading Historical Inclusion Times...' : ''}
                                estimatedInclusionTime={loadingEstimatedInclusionTime ? undefined: estimatedInclusionTime}
                            />
                        ))}
                    </OverviewCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default InclusionTime;
