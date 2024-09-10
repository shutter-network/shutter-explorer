import React, { FC, ChangeEvent } from 'react';
import { InputAdornment, IconButton, CircularProgress, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useSearch from '../hooks/useSearch';
import { SearchContainer, ChainSelect, ChainIcon, ChainName, DropdownIcon, StyledTextField } from '../styles/searchBar';
import chainIcon from '../assets/icons/gnosis.svg';
import dropdownIcon from '../assets/icons/chevron_down.svg';

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
        <SearchContainer>
            <ChainSelect>
                <ChainIcon src={chainIcon} alt="Chain Icon" />
                <ChainName>Gnosis Chain</ChainName>
                <DropdownIcon src={dropdownIcon} alt="Dropdown Icon" />
            </ChainSelect>

            <StyledTextField
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
        </SearchContainer>
    );
};

export default SearchBar;
