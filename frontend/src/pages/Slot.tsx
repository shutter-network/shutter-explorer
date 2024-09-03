import { Alert, Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import BasicTable from "../components/BasicTable";
import ResponsiveLayout from "../layouts/ResponsiveLayout";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { WebsocketEvent } from "../types/WebsocketEvent";

const Slot = () => {
    const { data: sequencerTransactionsData, loading: loadingSequencer, error: errorSequencer } = useFetch('/api/transaction/latest_sequencer_transactions');
    const { data: userTransactionsData, loading: loadingUser, error: errorUser } = useFetch('/api/transaction/latest_user_transactions');

    const sequencerTransactionColumns = [
        { id: 'hash', label: 'Sequencer Transaction Hash', minWidth: 170 },
    ];

    const userTransactionColumns = [
        { id: 'hash', label: 'User Transaction Hash', minWidth: 170 },
        { id: 'status', label: 'Status', minWidth: 100 },
    ];

    const [sequencerTransactions, setSequencerTransactions] = useState(sequencerTransactionsData?.transactions || []);
    const [userTransactions, setUserTransactions] = useState(userTransactionsData?.transactions || []);
    const [webSocketError, setWebSocketError] = useState<string | null>(null); // State to store WebSocket errors

    const { socket } = useWebSocket()!;

    useEffect(() => {
        if (sequencerTransactionsData?.transactions) {
            setSequencerTransactions(sequencerTransactionsData.transactions);
        }
        if (userTransactionsData?.transactions) {
            setUserTransactions(userTransactionsData.transactions);
        }
    }, [sequencerTransactionsData, userTransactionsData]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event: MessageEvent) => {
                const websocketEvent = JSON.parse(event.data) as WebsocketEvent;

                if (websocketEvent.error) {
                    setWebSocketError(`Error: ${websocketEvent.error.message} (Code: ${websocketEvent.error.code})`);
                } else if (websocketEvent.data) {
                    setWebSocketError(null);
                    switch (websocketEvent.type) {
                        case 'sequencer_transactions_updated':
                            setSequencerTransactions(websocketEvent.data);
                            break;

                        case 'user_transactions_updated':
                            setUserTransactions(websocketEvent.data);
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
    }, [socket]);

    return (
        <ResponsiveLayout>
            <Box sx={{ flexGrow: 1, marginTop: 4 }}>
                <Typography variant="h5" align="left">
                    Slot Overview
                </Typography>
                {webSocketError && <Alert severity="error">{webSocketError}</Alert>}
                <Grid container spacing={3}>
                    <Grid size={12}>
                        {errorSequencer ? (
                            <Alert severity="error">Error fetching sequencer transactions: {errorSequencer.message}</Alert>
                        ) : (
                            <>
                                <Typography variant="h6">Sequencer Transactions</Typography>
                                {loadingSequencer ? (
                                    <Typography>Loading...</Typography>
                                ) : (
                                    <BasicTable columns={sequencerTransactionColumns} rows={sequencerTransactions} />
                                )}
                            </>
                        )}
                    </Grid>
                    <Grid size={12}>
                        {errorUser ? (
                            <Alert severity="error">Error fetching user transactions: {errorUser.message}</Alert>
                        ) : (
                            <>
                                <Typography variant="h6">User Transactions</Typography>
                                {loadingUser ? (
                                    <Typography>Loading...</Typography>
                                ) : (
                                    <BasicTable columns={userTransactionColumns} rows={userTransactions} />
                                )}
                            </>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </ResponsiveLayout>
    );
};

export default Slot;
