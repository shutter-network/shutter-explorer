import { Alert, Box } from '@mui/material';
import InfoBox from '../components/InfoBox';
import OverviewCard from '../components/OverviewCard';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import useFetch from '../hooks/useFetch';
import overviewIcon from '../assets/icons/shutter.svg';

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
                const websocketEvent = JSON.parse(event.data);
                if (websocketEvent.error) {
                    setWebSocketError(`Error: ${websocketEvent.error.message} (Code: ${websocketEvent.error.code})`);
                } else if (websocketEvent.data) {
                    setWebSocketError(null);
                    switch (websocketEvent.type) {
                        case 'gnosis_chain_keypers_updated':
                            if ('count' in websocketEvent.data) {
                                setKeyperCount(websocketEvent.data.count);
                            }
                            break;
                        case 'keyper_threshold_updated':
                            if ('threshold' in websocketEvent.data) {
                                setKeyperThreshold(websocketEvent.data.threshold);
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
        if (keyperCountData?.keyperCount) setKeyperCount(keyperCountData.keyperCount);
        if (keyperThresholdData?.keyperThreshold) setKeyperThreshold(keyperThresholdData.keyperThreshold);
    }, [keyperCountData, keyperThresholdData]);

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            {webSocketError && <Alert severity="error">{webSocketError}</Alert>}
                    <OverviewCard title="Keyper Overview" iconSrc={overviewIcon}>
                        {errorKeyperCount ? (
                            <Alert severity="error">Error fetching keyper count: {errorKeyperCount.message}</Alert>
                        ) : (
                            <InfoBox
                                title="# Gnosis Chain Keypers"
                                tooltip="Number of keypers for Gnosis Chain"
                                value={loadingKeyperCount ? 'Loading...' : keyperCount}
                            />
                        )}
                        {errorKeyperThreshold ? (
                            <Alert severity="error">Error fetching keyper threshold: {errorKeyperThreshold.message}</Alert>
                        ) : (
                            <InfoBox
                                title="Keyper Threshold"
                                tooltip="Threshold number of keypers required for operation"
                                value={loadingKeyperThreshold ? 'Loading...' : keyperThreshold}
                            />
                        )}
                    </OverviewCard>
        </Box>
    );
};

export default Keyper;
