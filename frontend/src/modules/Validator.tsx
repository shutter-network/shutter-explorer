import { Alert, Box } from '@mui/material';
import InfoBox from '../components/InfoBox';
import OverviewCard from '../components/OverviewCard';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import useFetch from '../hooks/useFetch';
import overviewIcon from '../assets/icons/shield_check.svg';
import { WebsocketEvent } from '../types/WebsocketEvent';
import { getTimeDiff, truncateDecimals } from '../utils/utils';


const Validator = () => {
    const { data: shutterizedValidatorsData, loading: loadingShutterized, error: errorShutterized } = useFetch(`/api/validator/total_registered_validators`);
    const { data: totalValidatorsData, loading: loadingTotal, error: errorTotal } = useFetch('/api/validator/total_gnosis_validators');

    const [shutterizedValidators, setShutterizedValidators] = useState(shutterizedValidatorsData?.message || 'N/A');
    const [validatorPercentage, setValidatorPercentage] = useState(truncateDecimals((shutterizedValidatorsData?.message * 100) / totalValidatorsData?.message) || 'N/A');
    const [totalValidators, setTotalValidators] = useState(totalValidatorsData?.message || 'N/A');
    const [timeAgo, setTimeAgo] = useState(Math.floor(Date.now() / 1000));
    const [startTime, setStartTime] = useState(Math.floor(Date.now() / 1000));
    const [, setWebSocketError] = useState<string | null>(null);

    const { socket } = useWebSocket()!;

    useEffect(() => {
        if (socket) {
            const handleMessage = (event: MessageEvent) => {
                const websocketEvent = JSON.parse(event.data) as WebsocketEvent;
                if (websocketEvent.Error) {
                    setWebSocketError(`Error: ${websocketEvent.Error.message} (Code: ${websocketEvent.Error.code})`);
                } else if (websocketEvent.Data) {
                    setWebSocketError(null);
                    switch (websocketEvent.Type) {
                        case 'shutterized_validators_updated':
                            if ('count' in websocketEvent.Data) {
                                if (shutterizedValidators && shutterizedValidators != websocketEvent.Data.count) {
                                    setStartTime(Math.floor(Date.now() / 1000))
                                }
                                setShutterizedValidators(websocketEvent.Data.count);
                                setValidatorPercentage(truncateDecimals((websocketEvent.Data.count * 100) / totalValidators))
                            } else {
                                console.warn('Invalid data format for shutterized_validators_updated');
                            }
                            break;
                        case 'total_validators_updated':
                            if ('count' in websocketEvent.Data) {
                                if (totalValidators && totalValidators != websocketEvent.Data.count) {
                                    setStartTime(Math.floor(Date.now() / 1000))
                                }
                                setTotalValidators(websocketEvent.Data.count);
                                setValidatorPercentage(truncateDecimals((shutterizedValidators * 100) / websocketEvent.Data.count))
                            } else {
                                console.warn('Invalid data format for total_validators_updated');
                            }
                            break;
                        default:
                            console.warn('Unhandled WebSocket event type:', websocketEvent.Type);
                    }
                } else {
                    setWebSocketError(`Received null data for event type: ${websocketEvent.Type}`);
                    console.warn('Received null data for event type:', websocketEvent.Type);
                }
            };

            const handleError = () => {
                setWebSocketError('WebSocket error: A connection error occurred');
                console.error('WebSocket error: A connection error occurred');
            };

            socket.addEventListener('message', handleMessage)
            socket.addEventListener('error', handleError)

            return () => {
                socket.removeEventListener('message', handleMessage)
                socket.removeEventListener('error', handleError)
            };
        }


    }, [socket, shutterizedValidators, totalValidators]);

    useEffect(() => {
        if (shutterizedValidatorsData?.message) {
            setShutterizedValidators(shutterizedValidatorsData.message);
        }
        if (totalValidatorsData?.message) {
            setTotalValidators(totalValidatorsData.message);
        }
        setValidatorPercentage(truncateDecimals((shutterizedValidatorsData?.message * 100) / totalValidatorsData?.message));
    }, [shutterizedValidatorsData, totalValidatorsData]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeAgo(prevSeconds => prevSeconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeAgo]);

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <OverviewCard title="Validator Overview" iconSrc={overviewIcon} timeAgo={getTimeDiff(startTime, timeAgo)}>
                {/* Error handling and InfoBox display */}
                {errorShutterized ? (
                    <Alert severity="error">Error fetching shutterized validators: {errorShutterized.message}</Alert>
                ) : (
                    <InfoBox
                        title="# Shutterized Validators"
                        tooltip="Total number of shutterized validators"
                        value={loadingShutterized ? 'Loading...' : shutterizedValidators}
                    />
                )}

                {errorShutterized || errorTotal ? (
                    errorShutterized ? (
                        <Alert severity="error">
                            Error fetching validator percentage: {errorShutterized?.message}
                        </Alert>
                    ) : errorTotal ? (
                        <Alert severity="error">
                            Error fetching validator percentage: {errorTotal?.message}
                        </Alert>
                    ) : null
                ) : (
                    <InfoBox
                        title="Validator Percentage"
                        tooltip="Percentage amongst all validators"
                        value={
                            loadingShutterized || loadingTotal
                                ? "Loading..."
                                : `${validatorPercentage}%`
                        }
                    />
                )}

                {errorTotal ? (
                    <Alert severity="error">Error fetching total validators: {errorTotal.message}</Alert>
                ) : (
                    <InfoBox
                        title="# Validators"
                        tooltip="Total number of validators"
                        value={loadingTotal ? 'Loading...' : totalValidators}
                    />
                )}
            </OverviewCard>
        </Box>
    );
};

export default Validator;