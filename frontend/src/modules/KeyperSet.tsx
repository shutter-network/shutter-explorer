import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import InfoBox from "../components/InfoBox";

const KeyperSet: FC = () => {
    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            {/* Section Title */}
            <Typography variant="h5" align="left">
                Keyper Set Overview
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <InfoBox
                        title="Keyperset Index (Eon)"
                        tooltip="TBD"
                        value="1"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <InfoBox
                        title="Eon Key"
                        tooltip="TBD"
                        value="0x123...789"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <InfoBox
                        title="Activation Block Number"
                        tooltip="TBD"
                        value="789123"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <InfoBox
                        title="Keyper Addresses"
                        tooltip="TBD"
                        value={["0x7D04d2EdC058a1afc761d9C99aE4fc5C85d4c8a6", "0x7D04d2EdC058a1afc761d9C99aE4fc5C85d4c8a6"]}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <InfoBox
                        title="Keyper Contract Addresses"
                        tooltip="TBD"
                        value={["0x7D04d2EdC058a1afc761d9C99aE4fc5C85d4c8a6", "0x7D04d2EdC058a1afc761d9C99aE4fc5C85d4c8a6"]}
                    />
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default KeyperSet;
