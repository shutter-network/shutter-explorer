import { Alert, Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import InfoBox from "../components/InfoBox";
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { WebsocketEvent } from "../types/WebsocketEvent";
import useFetch from "../hooks/useFetch";

const Validator = () => {
    const { data: shutterizedValidatorsData, loading: loadingShutterized, error: errorShutterized } = useFetch('/api/validator/shutterized_validators');
    const { data: validatorPercentageData, loading: loadingPercentage, error: errorPercentage } = useFetch('/api/validator/validator_percentage');
    const { data: totalValidatorsData, loading: loadingTotal, error: errorTotal } = useFetch('/api/validator/total_validators');

    const [shutterizedValidators, setShutterizedValidators] = useState(shutterizedValidatorsData?.count || 'N/A');
    const [validatorPercentage, setValidatorPercentage] = useState(validatorPercentageData?.percentage || 'N/A');
    const [totalValidators, setTotalValidators] = useState(totalValidatorsData?.total || 'N/A');
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
                        case 'shutterized_validators_updated':
                            if ('count' in websocketEvent.data) {
                                setShutterizedValidators(websocketEvent.data.count);
                            } else {
                                console.warn('Invalid data format for shutterized_validators_updated');
                            }
                            break;
                        case 'validator_percentage_updated':
                            if ('percentage' in websocketEvent.data) {
                                setValidatorPercentage(websocketEvent.data.percentage);
                            } else {
                                console.warn('Invalid data format for validator_percentage_updated');
                            }
                            break;
                        case 'total_validators_updated':
                            if ('count' in websocketEvent.data) {
                                setTotalValidators(websocketEvent.data.count);
                            } else {
                                console.warn('Invalid data format for total_validators_updated');
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
        if (shutterizedValidatorsData?.count) setShutterizedValidators(shutterizedValidatorsData.count);
        if (validatorPercentageData?.percentage) setValidatorPercentage(validatorPercentageData.percentage);
        if (totalValidatorsData?.total) setTotalValidators(totalValidatorsData.total);
    }, [shutterizedValidatorsData, validatorPercentageData, totalValidatorsData]);

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <Typography variant="h5" align="left">
                Validator Overview
            </Typography>
            {webSocketError && <Alert severity="error">{webSocketError}</Alert>}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    {errorShutterized ? (
                        <Alert severity="error">Error fetching shutterized validators: {errorShutterized.message}</Alert>
                    ) : (
                        <InfoBox
                            title="# Shutterized Validators"
                            tooltip="Total number of shutterized validators"
                            value={loadingShutterized ? 'Loading...' : shutterizedValidators}
                        />
                    )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    {errorPercentage ? (
                        <Alert severity="error">Error fetching validator percentage: {errorPercentage.message}</Alert>
                    ) : (
                        <InfoBox
                            title="Validator Percentage"
                            tooltip="Percentage amongst all validators"
                            value={loadingPercentage ? 'Loading...' : `${validatorPercentage}%`}
                        />
                    )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    {errorTotal ? (
                        <Alert severity="error">Error fetching total validators: {errorTotal.message}</Alert>
                    ) : (
                        <InfoBox
                            title="# Validators"
                            tooltip="TBD"
                            value={loadingTotal ? 'Loading...' : totalValidators}
                        />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Validator;
