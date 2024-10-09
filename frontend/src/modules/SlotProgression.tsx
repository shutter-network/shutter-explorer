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

const calculateCurrentSlotAndEpoch = (genesisTime: number, slotDuration: number) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const currentSlot = Math.floor((currentTime - genesisTime) / slotDuration);
    const currentEpoch = Math.floor(currentSlot / 16);
    const relativeSlotIndex = currentSlot % 16;
    return { currentEpoch, relativeSlotIndex, currentSlot };
};

const SlotProgression = () => {
    const [forceRefetch, setForceRefetch] = useState(false);
    const { data: slotData, loading: loadingSlots, error: errorSlots } = useFetch('/api/slot/top_5_epochs', forceRefetch);
    const [currentEpochSlots, setCurrentEpochSlots] = useState<any[]>([]);
    const [nextEpochSlots, setNextEpochSlots] = useState<any[]>([]);
    const [currentEpoch, setCurrentEpoch] = useState<number>(0);
    const [currentSlotIndex, setCurrentSlotIndex] = useState<number>(0);

    const gnosisGenesisTime = 1638993340;
    const slotDuration = 5;

    // useEffect for Initial Data Fetching and Slot/Epoch Setup
    useEffect(() => {
        if (slotData && Array.isArray(slotData.message)) {
            console.log('Initial slot data received from API:', slotData);

            const sortedSlots = slotData.message.sort((a: any, b: any) => a.Slot - b.Slot);
            const { currentEpoch, relativeSlotIndex } = calculateCurrentSlotAndEpoch(gnosisGenesisTime, slotDuration);

            const currentEpochSlotsData = sortedSlots.filter(
                (slot: any) => slot.Slot >= currentEpoch * 16 && slot.Slot < (currentEpoch + 1) * 16
            );
            const nextEpochSlotsData = sortedSlots.filter(
                (slot: any) => slot.Slot >= (currentEpoch + 1) * 16 && slot.Slot < (currentEpoch + 2) * 16
            );

            setCurrentEpochSlots(currentEpochSlotsData); // Load current epoch slots
            setNextEpochSlots(nextEpochSlotsData); // Preload next epoch slots
            setCurrentEpoch(currentEpoch);
            setCurrentSlotIndex(relativeSlotIndex);

            console.log('Current Epoch Slots:', currentEpochSlotsData);
            console.log('Next Epoch Slots:', nextEpochSlotsData);
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
                    return prevIndex + 1; // Move to the next slot within the current epoch
                } else {
                    console.log('Transitioning to the next epoch');
                    setCurrentEpoch((prevEpoch) => prevEpoch + 1);
                    setCurrentEpochSlots(nextEpochSlots); // Use the preloaded next epoch slots as the current epoch slots
                    setNextEpochSlots([]); // Clear the next epoch slots temporarily
                    setForceRefetch((prev) => !prev); // Toggle the forceRefetch state to trigger a data refetch

                    return 0; // Reset slot index to the beginning of the new epoch
                }
            });
        }, slotDuration * 1000);

        return () => clearInterval(slotInterval);
    }, [nextEpochSlots]);

    const slotsToDisplay = currentEpochSlots;

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

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            {errorSlots ? (
                <Alert severity="error">Error fetching Slot data: {errorSlots.message}</Alert>
            ) : (
                <SlotDetailsWrapper>
                    <Typography variant="h2" align="left">Epoch {currentEpoch}</Typography>
                    <SlotVisualizer>
                        {loadingSlots ? (
                            <p>Loading slot progression...</p>
                        ) : (
                            slotsToDisplay.map((slot: any) => renderSlotBlock(slot))
                        )}
                    </SlotVisualizer>

                    <PreviousSlotDetails>
                        <Typography variant="h2" align="left">Slot Details</Typography>
                        <DetailsGrid>
                            <DetailCard title="Slot number" value={slotsToDisplay[currentSlotIndex]?.Slot || 'N/A'} />
                            <DetailCard title="Validator Index" value={slotsToDisplay[currentSlotIndex]?.ValidatorIndex || 'N/A'} />
                            <DetailCard title="Shutterized" value={slotsToDisplay[currentSlotIndex]?.IsRegisteration ? 'Yes' : 'No'} />
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
