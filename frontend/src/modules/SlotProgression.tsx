import { Alert, Box, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import {
    SlotDetailsWrapper,
    SlotVisualizer,
    SlotBlock,
    PreviousSlotDetails,
    DetailsGrid,
    Card,
    CardValue,
    CardTitle,
    StyledShutterLogoIcon,
} from '../styles/slotProgression';

const calculateCurrentSlotAndEpoch = (genesisTime: number, slotDuration: number, currentTime = Date.now()) => {
    const currentSlot = Math.floor((currentTime / 1000 - genesisTime) / slotDuration);
    console.log("Current slot in code" + currentSlot);
    const currentEpoch = Math.floor(currentSlot / 16);
    const relativeSlotIndex = currentSlot % 16;
    return { currentEpoch, relativeSlotIndex, currentSlot };
};

const SlotProgression = () => {
    const [forceRefetch, setForceRefetch] = useState(false);
    const { data: slotData, loading: loadingSlots, error: errorSlots } = useFetch('/api/slot/top_5_epochs', forceRefetch);
    const [epochsSlots, setEpochsSlots] = useState<any[]>([]);
    const [currentEpoch, setCurrentEpoch] = useState<number>(0);
    const [currentSlotIndex, setCurrentSlotIndex] = useState<number>(0);

    const gnosisGenesisTime = 1638993340;
    const slotDuration = 5;

    // useEffect for Initial Data Fetching and Slot/Epoch Setup
    useEffect(() => {
        if (slotData && Array.isArray(slotData.message)) {
            console.log('Initial slot data received from API:', slotData);

            const sortedSlots = slotData.message.sort((a: any, b: any) => a.Slot - b.Slot);

            const epochsMap = new Map<number, any[]>();
            sortedSlots.forEach((slot: any) => {
                const epoch = Math.floor(slot.Slot / 16);
                if (!epochsMap.has(epoch)) {
                    epochsMap.set(epoch, []);
                }
                epochsMap.get(epoch)?.push(slot);
            });

            const epochsData = Array.from(epochsMap.entries()).map(([epoch, slots]) => ({
                epoch,
                slots,
            }));

            setEpochsSlots(epochsData);
            const { currentEpoch, relativeSlotIndex } = calculateCurrentSlotAndEpoch(gnosisGenesisTime, slotDuration);
            setCurrentEpoch(currentEpoch);
            setCurrentSlotIndex(relativeSlotIndex);

            console.log('Epochs Data:', epochsData);
            console.log('Current Epoch:', currentEpoch, 'Current Slot Index:', relativeSlotIndex);
        } else {
            console.warn('Invalid slot data structure received from the API:', slotData);
        }
    }, [slotData]);

    // useEffect for Slot Progression and Epoch Transitions
    useEffect(() => {
        const slotInterval = setInterval(() => {
            setCurrentSlotIndex((prevIndex) => {
                const currentEpochEndSlot = 15;

                if (prevIndex < currentEpochEndSlot) {
                    console.log('Moving to the next slot within the current epoch');
                    return prevIndex + 1;
                } else {
                    console.log('Transitioning to the next epoch');
                    setCurrentEpoch((prevEpoch) => prevEpoch + 1);
                    setForceRefetch((prev) => !prev); // Trigger a data refetch for new epoch data

                    return 0; // Reset slot index to the beginning of the new epoch
                }
            });
        }, slotDuration * 1000);

        return () => clearInterval(slotInterval);
    }, []);

    const renderSlotBlock = (slot: any) => {
        const isCurrentSlot = slot.Slot === currentSlotIndex + currentEpoch * 16;
        const isShutterized = slot.IsRegisteration === true;
        const isPassed = slot.Slot < currentSlotIndex + currentEpoch * 16;

        return (
            <SlotBlock
                key={slot.Slot}
                isActive={isCurrentSlot}
                isShutterized={isShutterized}
                isPassed={isPassed}
            >
                {isShutterized && <StyledShutterLogoIcon isActive={isCurrentSlot} isPassed={isPassed} />}
            </SlotBlock>
        );
    };

    const filteredEpochsSlots = epochsSlots.filter(({ epoch }) =>
        epoch >= currentEpoch - 1 && epoch <= currentEpoch + 1
    );

    const currentEpochSlots = epochsSlots.find((epoch) => epoch.epoch === currentEpoch);
    const currentSlotData = currentEpochSlots?.slots[currentSlotIndex];

    return (
        <Box sx={{ flexGrow: 1 }}>
            {errorSlots ? (
                <Alert severity="error">Error fetching Slot data: {errorSlots.message}</Alert>
            ) : (
                <SlotDetailsWrapper>
                    {loadingSlots ? (
                        <p>Loading slot progression...</p>
                    ) : (
                        filteredEpochsSlots.map(({ epoch, slots }) => (
                            <div key={epoch}>
                                <Typography variant="h2" align="left" paddingTop={"20px"}>
                                    Epoch {epoch}
                                </Typography>
                                <SlotVisualizer>
                                    {slots.map((slot: any) => renderSlotBlock(slot))}
                                </SlotVisualizer>
                            </div>
                        ))
                    )}

                    <PreviousSlotDetails>
                        <Typography variant="h2" align="left">Slot Details</Typography>
                        <DetailsGrid>
                            <DetailCard
                                title="Slot number"
                                value={currentSlotData?.Slot || 'N/A'}
                            />
                            <DetailCard
                                title="Validator Index"
                                value={currentSlotData?.ValidatorIndex || 'N/A'}
                            />
                            <DetailCard
                                title="Shutterized"
                                value={currentSlotData?.IsRegisteration ? 'Yes' : 'No'}
                            />
                        </DetailsGrid>
                    </PreviousSlotDetails>
                </SlotDetailsWrapper>
            )}
        </Box>
    );
};

interface DetailCardProps {
    title: string;
    value: string | number;
}

const DetailCard: FC<DetailCardProps> = ({ title, value }) => (
    <Card>
        <CardValue>{value}</CardValue>
        <CardTitle>{title}</CardTitle>
    </Card>
);

export default SlotProgression;
