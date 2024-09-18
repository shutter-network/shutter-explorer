import { Alert, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import OverviewCard from '../components/OverviewCard';
import CustomLineChart from '../components/CustomLineChart';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import useFetch from '../hooks/useFetch';
import { HistoricalInclusionTimeResponse } from '../types/WebsocketEvent';

const InclusionTime = () => {
    const { data: historicalInclusionTimeData, loading: loadingHistoricalInclusionTime, error: errorHistoricalInclusionTime } = useFetch('/api/inclusion_time/historical_inclusion_time');

    const [historicalInclusionTime, setHistoricalInclusionTime] = useState(historicalInclusionTimeData?.message || []);
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
        if (historicalInclusionTimeData?.message) setHistoricalInclusionTime(historicalInclusionTimeData.message);
    }, [historicalInclusionTimeData]);

    const historicalTrasactionData = historicalInclusionTime.map((data: HistoricalInclusionTimeResponse) => ({
        day: data.SubmissionDateUnix,
        averageInclusionTime: data.AvgInclusionTimeSeconds,
    }));

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <OverviewCard title="Historical Inclusion Time">
                        {errorHistoricalInclusionTime ? (
                            <Alert severity="error">Error fetching Historical Inclusion Times: {errorHistoricalInclusionTime.message}</Alert>
                        ) : (
                            <CustomLineChart
                                data={loadingHistoricalInclusionTime ? [] : historicalTrasactionData}
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
