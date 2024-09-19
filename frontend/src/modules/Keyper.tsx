import { Box, Typography } from '@mui/material';
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
                <Typography sx={{ paddingLeft: 2, textAlign: "left" }} >Shutter DAOs have already selected and approved 22 Keypers to be eligible to operate keyper clients for various Shutter-protected protocols (e.g. Shutter for Gnosis Chain or Shutter for Snapshot Shielded Voting). The current subset of 7 are voluntary Genesis Keypers specifically for Gnosis Chain.</Typography>
            </OverviewCard>
        </Box>
    );
};

export default Keyper;
