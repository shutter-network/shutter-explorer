import { Box } from '@mui/material';
import InfoBox from '../components/InfoBox';
import OverviewCard from '../components/OverviewCard';
import overviewIcon from '../assets/icons/shutter.svg';

const Keyper = () => {
    const keyperCount = 7;
    const keyperThreshold = 3;

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <OverviewCard title="Keyper Overview" iconSrc={overviewIcon}>
                <InfoBox
                    title="Gnosis Chain Keypers"
                    tooltip="Number of keypers for Gnosis Chain"
                    value={keyperCount}
                />

                <InfoBox
                    title="Keyper Threshold"
                    tooltip="Threshold number of keypers required for operation"
                    value={keyperThreshold}
                />
            </OverviewCard>
        </Box>
    );
};

export default Keyper;
