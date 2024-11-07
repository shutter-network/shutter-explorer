import { Alert, Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import BasicTable from "../components/BasicTable";
import ResponsiveLayout from "../components/ResponsiveLayout";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { SequencerTransaction, Transaction, WebsocketEvent, SequencerTransactions } from "../types/WebsocketEvent";
import { getTimeAgo, getTimeDiff } from 'utils/utils';
import TitleSection from "../components/TitleSection";
import SlotProgression from "../modules/SlotProgression";
import RefreshContainer from 'components/RefreshContainer';

const Slot = () => {
    const { data: sequencerTransactionsData, loading: loadingSequencer, error: errorSequencer } = useFetch('/api/transaction/latest_sequencer_transactions?limit=10');
    const { data: userTransactionsData, loading: loadingUser, error: errorUser } = useFetch('/api/transaction/latest_user_transactions?limit=10');

    const sequencerTransactionColumns = [
        { id: 'timestamp', label: 'Tx Age', minWidth: 120 },
        { id: 'hash', label: 'Sequencer Transaction Hash', minWidth: 170 },
    ];

    const userTransactionColumns = [
        { id: 'timestamp', label: 'Tx Age', minWidth: 120 },
        { id: 'hash', label: 'User Transaction Hash', minWidth: 170 },
    ];

    const [sequencerTransactions, setSequencerTransactions] = useState(sequencerTransactionsData?.message || []);
    const [userTransactions, setUserTransactions] = useState(userTransactionsData?.message || []);
    const [, setWebSocketError] = useState<string | null>(null); // State to store WebSocket errors
    const [isMobile, setIsMobile] = useState(false);
    const [timeAgo, setTimeAgo] = useState(Math.floor(Date.now() / 1000));
    const [seqStartTime, setSeqStartTime] = useState(Math.floor(Date.now() / 1000));
    const [userStartTime, setUserStartTime] = useState(Math.floor(Date.now() / 1000));

    const handleResize = () => {
        setIsMobile(window.matchMedia("(max-width: 900px)").matches);
    };

    const { socket } = useWebSocket()!;

    useEffect(() => {
        handleResize();
        // Event listener for resizing
        window.addEventListener("resize", handleResize);

        // Clean up listener on component unmount
        return () => window.removeEventListener("resize", handleResize);
    }, [])
    useEffect(() => {
        if (sequencerTransactionsData?.message) {
            console.log("called in first useffect", sequencerTransactionsData.message)
            setSequencerTransactions(sequencerTransactionsData.message);
        }
        if (userTransactionsData?.message) {
            setUserTransactions(userTransactionsData.message);
        }
    }, [sequencerTransactionsData, userTransactionsData]);

    useEffect(() => {
        if (socket) {
            const handleMessage = (event: MessageEvent) => {
                const websocketEvent = JSON.parse(event.data) as WebsocketEvent;
                if (websocketEvent.Error) {
                    setWebSocketError(`Error: ${websocketEvent.Error.message} (Code: ${websocketEvent.Error.code})`);
                } else if (websocketEvent.Data) {
                    setWebSocketError(null);
                    switch (websocketEvent.Type) {
                        case 'latest_sequencer_transactions_updated':
                            let newSequencerData: any = websocketEvent.Data
                            if (sequencerTransactions?.length > 0 &&
                                sequencerTransactions[0].SequencerTxHash != newSequencerData[0].SequencerTxHash) {
                                setSeqStartTime(Math.floor(Date.now() / 1000));
                            }
                            setSequencerTransactions(websocketEvent.Data);
                            break;

                        case 'latest_user_transactions_updated':
                            let newUserData: any = websocketEvent.Data
                            if (userTransactions?.length > 0 &&
                                userTransactions[0].TxHash != newUserData[0].TxHash) {
                                setUserStartTime(Math.floor(Date.now() / 1000));
                            }
                            setUserTransactions(websocketEvent.Data);
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
            }
        }
    }, [socket, sequencerTransactions, userTransactions]);


    useEffect(() => {
        const interval = setInterval(() => {
            setTimeAgo(prevSeconds => prevSeconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeAgo]);


    const sequencerTransactionsWithAge = sequencerTransactions.map((transaction: SequencerTransaction) => ({
        hash: transaction.SequencerTxHash,
        timestamp: getTimeAgo(transaction.CreatedAtUnix),
    }));

    const userTransactionsWithAge = userTransactions.map((transaction: Transaction) => ({
        hash: transaction.TxHash,
        timestamp: getTimeAgo(transaction.IncludedAtUnix),
    }));

    return (
        <ResponsiveLayout>
            <Box sx={{ flexGrow: 1, marginTop: 4 }}>
                <TitleSection title="Slot Overview" />
                <Typography variant="body1" textAlign="left" paddingTop="20px" lineHeight="180%" fontSize={"18px"}>
                    The slot overview is designed to give you information about the activity around the current blockchain's state.
                    It gives a look ahead to the next 16 slots and shows when a registered validator is scheduled.
                    A green background means that the slot has passed. The Shutter logo means the corresponding proposer will include encrypted transactions.
                    Additionally, it shows the 10 recent sequencer and successfully executed user transactions which were included through the encrypted mempool.
                </Typography>
                <SlotProgression />
                <Grid container spacing={2} sx={{ marginTop: 4 }}>
                    <Grid size={{ sm: 12, md: 12, lg: 6, xs: 'auto' }} >
                        {errorSequencer ? (
                            <Alert severity="error">Error fetching sequencer transactions: {errorSequencer.message}</Alert>
                        ) : (
                            <>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Typography variant="h5" align='left' sx={{ fontWeight: 'bold' }} color='black' style={{ marginRight: "10px" }} >Sequencer Transactions</Typography>
                                    <RefreshContainer time={getTimeDiff(seqStartTime, timeAgo)} />
                                </div>
                                {loadingSequencer ? (
                                    <Typography>Loading...</Typography>
                                ) : (
                                    <BasicTable columns={sequencerTransactionColumns} rows={sequencerTransactionsWithAge} isMobile={isMobile} />
                                )}
                            </>
                        )}
                    </Grid>
                    <Grid size={{ sm: 12, md: 12, lg: 6, xs: 'auto' }}>
                        {errorUser ? (
                            <Alert severity="error">Error fetching user transactions: {errorUser.message}</Alert>
                        ) : (
                            <>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Typography variant="h5" align='left' sx={{ fontWeight: 'bold' }} color='black' style={{ marginRight: "10px" }} >Shielded User Transactions</Typography>
                                    <RefreshContainer time={getTimeDiff(userStartTime, timeAgo)} />
                                </div>
                                {loadingUser ? (
                                    <Typography>Loading...</Typography>
                                ) : (
                                    <BasicTable columns={userTransactionColumns} rows={userTransactionsWithAge} isMobile={isMobile} />
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
