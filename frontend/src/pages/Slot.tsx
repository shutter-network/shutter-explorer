import { Alert, Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import BasicTable from "../components/BasicTable";
import ResponsiveLayout from "../components/ResponsiveLayout";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import {SequencerTransaction, Transaction, WebsocketEvent} from "../types/WebsocketEvent";
import {getTimeAgo} from "../utils/utils";
import TitleSection from "../components/TitleSection";

const Slot = () => {
    const { data: sequencerTransactionsData, loading: loadingSequencer, error: errorSequencer } = useFetch('/api/transaction/latest_sequencer_transactions?limit=10');
    const { data: userTransactionsData, loading: loadingUser, error: errorUser } = useFetch('/api/transaction/latest_user_transactions?limit=10');

    const sequencerTransactionColumns = [
        { id: 'hash', label: 'Sequencer Transaction Hash', minWidth: 170 },
        { id: 'timestamp', label: 'Submission time (Age)', minWidth: 170 },
    ];

    const userTransactionColumns = [
        { id: 'hash', label: 'User Transaction Hash', minWidth: 170 },
        { id: 'timestamp', label: 'Inclusion time (Age)', minWidth: 170 },
    ];

    const [sequencerTransactions, setSequencerTransactions] = useState(sequencerTransactionsData?.message || []);
    const [userTransactions, setUserTransactions] = useState(userTransactionsData?.message || []);
    const [webSocketError, setWebSocketError] = useState<string | null>(null); // State to store WebSocket errors

    const { socket } = useWebSocket()!;

    useEffect(() => {
        if (sequencerTransactionsData?.message) {
            setSequencerTransactions(sequencerTransactionsData.message);
        }
        if (userTransactionsData?.message) {
            setUserTransactions(userTransactionsData.message);
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

    const sequencerTransactionsWithAge = sequencerTransactions.map((transaction: SequencerTransaction) => ({
        hash: truncateString(transaction.SequencerTxHash, 50),
        timestamp: getTimeAgo(transaction.CreatedAtUnix),
    }));

    const userTransactionsWithAge = userTransactions.map((transaction: Transaction) => ({
        hash: truncateString(transaction.TxHash, 50),
        timestamp: getTimeAgo(transaction.IncludedAtUnix),
    }));


    function truncateString(str: string, num: number): string {
        if (str.length <= num) {
            return str;
        }
        return str.slice(0, num) + '...';
    }

    return (
        <ResponsiveLayout>
            <Box sx={{ flexGrow: 1, marginTop: 4 }}>
                <TitleSection title="Slot Overview" />
                {webSocketError && <Alert severity="error">{webSocketError}</Alert>}
                <Grid container spacing={2} sx={{ marginTop: 4 }}>
                    <Grid size={{ sm: 12, md: 12, lg: 6 }} >
                        {errorSequencer ? (
                            <Alert severity="error">Error fetching sequencer transactions: {errorSequencer.message}</Alert>
                        ) : (
                            <>
                                <Typography variant="h5" align='left' sx={{ fontWeight: 'bold' }} color='black' >Sequencer Transactions</Typography>
                                {loadingSequencer ? (
                                    <Typography>Loading...</Typography>
                                ) : (
                                    <BasicTable columns={sequencerTransactionColumns} rows={sequencerTransactionsWithAge} />
                                )}
                            </>
                        )}
                    </Grid>
                    <Grid size={{ sm: 12, md: 12, lg: 6 }}>
                        {errorUser ? (
                            <Alert severity="error">Error fetching user transactions: {errorUser.message}</Alert>
                        ) : (
                            <>
                                <Typography variant="h5" align='left' sx={{ fontWeight: 'bold' }} color='black' > User Transactions</Typography>
                                {loadingUser ? (
                                    <Typography>Loading...</Typography>
                                ) : (
                                    <BasicTable columns={userTransactionColumns} rows={userTransactionsWithAge} />
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
