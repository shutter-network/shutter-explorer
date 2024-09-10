import { Alert, Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import InfoBox from '../components/InfoBox';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { WebsocketEvent } from '../types/WebsocketEvent';
import useFetch from '../hooks/useFetch';

const Keyper = () => {
    const { data: keyperCountData, loading: loadingKeyperCount, error: errorKeyperCount } = useFetch('/keyper/gnosis_chain_keypers');
    const { data: keyperThresholdData, loading: loadingKeyperThreshold, error: errorKeyperThreshold } = useFetch('/keypers/keyper_threshold');

    const [keyperCount, setKeyperCount] = useState<number | string>(keyperCountData?.keyperCount || 'N/A');
    const [keyperThreshold, setKeyperThreshold] = useState<number | string>(keyperThresholdData?.keyperThreshold || 'N/A');
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
                        case 'gnosis_chain_keypers_updated':
                            if ('count' in websocketEvent.data) {
                                setKeyperCount(websocketEvent.data.count);
                            } else {
                                console.warn('Invalid data format for keyper_count_updated');
                            }
                            break;
                        case 'keyper_threshold_updated':
                            if ('threshold' in websocketEvent.data) {
                                setKeyperThreshold(websocketEvent.data.threshold);
                            } else {
                                console.warn('Invalid data format for keyper_threshold_updated');
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
        if (keyperCountData?.keyperCount) setKeyperCount(keyperCountData.keyperCount);
        if (keyperThresholdData?.keyperThreshold) setKeyperThreshold(keyperThresholdData.keyperThreshold);
    }, [keyperCountData, keyperThresholdData]);

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <Typography variant="h5" align="left">
                Keyper Overview
            </Typography>
            {webSocketError && <Alert severity="error">{webSocketError}</Alert>}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    {errorKeyperCount ? (
                        <Alert severity="error">Error fetching keyper count: {errorKeyperCount.message}</Alert>
                    ) : (
                        <InfoBox
                            title="# Gnosis Chain Keypers"
                            tooltip="Number of keypers for Gnosis Chain"
                            value={loadingKeyperCount ? 'Loading...' : keyperCount}
                        />
                    )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    {errorKeyperThreshold ? (
                        <Alert severity="error">Error fetching keyper threshold: {errorKeyperThreshold.message}</Alert>
                    ) : (
                        <InfoBox
                            title="Keyper Threshold"
                            tooltip="Threshold number of keypers required for operation"
                            value={loadingKeyperThreshold ? 'Loading...' : keyperThreshold}
                        />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Keyper;
