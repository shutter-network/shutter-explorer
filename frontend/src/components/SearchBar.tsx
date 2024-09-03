import React, { FC, ChangeEvent } from 'react';
import { TextField, InputAdornment, IconButton, CircularProgress, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useSearch from '../hooks/useSearch';

interface SearchBarProps {
    placeholder: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: FC<SearchBarProps> = ({ placeholder, value, onChange }) => {
    const { searchTx, loading, error } = useSearch(value);

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            await searchTx();
        }
    };

    return (
        <>
            <TextField
                fullWidth
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={searchTx} disabled={loading}>
                                    {loading ? <CircularProgress size={24} /> : <SearchIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
            {loading && <Typography>Loading...</Typography>}
            {error && (
                <Typography color="error" variant="body2">
                    {error.message}
                </Typography>
            )}
        </>
    );
};

export default SearchBar;
