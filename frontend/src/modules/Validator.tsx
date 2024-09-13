import { Alert, Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import InfoBox from "../components/InfoBox";
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { WebsocketEvent } from "../types/WebsocketEvent";
import useFetch from "../hooks/useFetch";

const Validator = () => {
    const { data: shutterizedValidatorsData, loading: loadingShutterized, error: errorShutterized } = useFetch(`/api/validator/total_registered_validators`);
    const { data: totalValidatorsData, loading: loadingTotal, error: errorTotal } = useFetch('/api/validator/total_gnosis_validators');

    const [shutterizedValidators, setShutterizedValidators] = useState(shutterizedValidatorsData?.message || 'N/A');
    const [totalValidators, setTotalValidators] = useState(totalValidatorsData?.message || 'N/A');
    const [validatorPercentage, setValidatorPercentage] = useState((shutterizedValidatorsData?.message*100)/totalValidatorsData?.message || 'N/A');
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
        if (shutterizedValidatorsData?.message){
            setShutterizedValidators(shutterizedValidatorsData.message);
            setValidatorPercentage((shutterizedValidatorsData?.message*100)/totalValidatorsData?.message);
        } 
        if (totalValidatorsData?.message){
            setTotalValidators(totalValidatorsData.message);
            setValidatorPercentage((shutterizedValidatorsData?.message*100)/totalValidatorsData?.message);
        } 
    }, [shutterizedValidatorsData, totalValidatorsData]);

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
                    {errorShutterized || errorTotal ? (
                        errorShutterized?
                        <Alert severity="error">Error fetching validator percentage: {errorShutterized?.message}</Alert>:
                        errorTotal?
                        <Alert severity="error">Error fetching validator percentage: {errorTotal?.message}</Alert>:
                        null
                    ) : (
                        <InfoBox
                            title="Validator Percentage"
                            tooltip="Percentage amongst all validators"
                            value={loadingShutterized || loadingTotal ? 'Loading...' : `${validatorPercentage}%`}
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
