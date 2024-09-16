import { Alert, Box } from '@mui/material';
import InfoBox from '../components/InfoBox';
import OverviewCard from '../components/OverviewCard';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import useFetch from '../hooks/useFetch';
import overviewIcon from '../assets/icons/shield_check.svg';


const Validator = () => {
    const { data: shutterizedValidatorsData, loading: loadingShutterized, error: errorShutterized } = useFetch(`/api/validator/total_registered_validators`);
    const { data: validatorPercentageData, loading: loadingPercentage, error: errorPercentage } = useFetch('/api/validator/validator_percentage');
    const { data: totalValidatorsData, loading: loadingTotal, error: errorTotal } = useFetch('/api/validator/total_gnosis_validators');

    const [shutterizedValidators, setShutterizedValidators] = useState(shutterizedValidatorsData?.message || 'N/A');
    const [validatorPercentage, setValidatorPercentage] = useState(validatorPercentageData?.percentage || 'N/A');
    const [totalValidators, setTotalValidators] = useState(totalValidatorsData?.message || 'N/A');
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
                        case 'shutterized_validators_updated':
                            if ('count' in websocketEvent.data) {
                                setShutterizedValidators(websocketEvent.data.count);
                                setValidatorPercentage((websocketEvent.data.count*100)/totalValidators)
                            } else {
                                console.warn('Invalid data format for shutterized_validators_updated');
                            }
                            break;
                        case 'total_validators_updated':
                            if ('count' in websocketEvent.data) {
                                setTotalValidators(websocketEvent.data.count);
                                setValidatorPercentage((shutterizedValidators*100)/websocketEvent.data.count)
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
        } 
        if (totalValidatorsData?.message){
            setTotalValidators(totalValidatorsData.message);
        } 
        setValidatorPercentage((shutterizedValidatorsData?.message*100)/totalValidatorsData?.message);
    }, [shutterizedValidatorsData, totalValidatorsData]);

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            {webSocketError && <Alert severity="error">{webSocketError}</Alert>}

                    <OverviewCard title="Validator Overview" iconSrc={overviewIcon}>
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

                        {errorPercentage ? (
                            <Alert severity="error">Error fetching validator percentage: {errorPercentage.message}</Alert>
                        ) : (
                            <InfoBox
                                title="Validator Percentage"
                                tooltip="Percentage amongst all validators"
                                value={loadingPercentage ? 'Loading...' : `${validatorPercentage}%`}
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
