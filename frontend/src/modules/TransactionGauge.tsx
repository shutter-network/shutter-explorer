import { Alert, Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import OverviewCard from '../components/OverviewCard';
import BasicGauges from '../components/Gauge';
import { useState } from 'react';
import useFetch from '../hooks/useFetch';

const WINDOW_OPTIONS = [7, 30, 90, 'all'] as const;
type WindowOption = typeof WINDOW_OPTIONS[number];

const TransactionGauge = () => {
    const [window, setWindow] = useState<WindowOption>(30);
    const url = window === 'all'
        ? '/api/inclusion_time/executed_transactions'
        : `/api/inclusion_time/executed_transactions_recent?days=${window}`;
    const { data, loading, error } = useFetch(url);

    const shielded: number = data?.message?.Shielded || 0;
    const unshielded: number = data?.message?.Unshielded || 0;
    const total = shielded + unshielded;

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            <OverviewCard title="Shielded Transactions" centerTitle>
                <Box display="flex" justifyContent="center" mb={1}>
                    <ToggleButtonGroup
                        value={window}
                        exclusive
                        onChange={(_, v) => { if (v !== null) setWindow(v as WindowOption); }}
                        size="small"
                    >
                        {WINDOW_OPTIONS.map((d) => (
                            <ToggleButton key={d} value={d}>
                                {d === 'all' ? 'All' : `${d}d`}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
                <Typography
                    variant="body2"
                    align="center"
                    sx={{ color: 'text.secondary', mb: 1 }}
                >
                    {window === 'all' ? 'All time' : `Last ${window} days`}
                </Typography>
                {error ? (
                    <Alert severity="error">Error fetching Transaction Stats: {error.message}</Alert>
                ) : (
                    <BasicGauges
                        success={loading ? 0 : shielded}
                        total={loading ? 0 : total}
                        failed={loading ? 0 : unshielded}
                    />
                )}
            </OverviewCard>
        </Box>
    );
};

export default TransactionGauge;
