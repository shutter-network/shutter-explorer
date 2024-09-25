import React, { FC, ChangeEvent } from 'react';
import { InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
    SearchContainer,
    ChainSelect,
    ChainIcon,
    ChainName,
    StyledTextField,
    StyledDropdownIcon
} from '../styles/searchBar';
import chainIcon from '../assets/icons/gnosis.svg';
import { useNavigate } from 'react-router-dom';


interface SearchBarProps {
    placeholder: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: FC<SearchBarProps> = ({ placeholder, value, onChange }) => {
    const navigate = useNavigate();

    const searchTx = async (txHash: string) => {
        if (!txHash) return;
        navigate(`/transaction-details/${txHash}`);
    };

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            await searchTx(value);
        }
    };

    return (
        <SearchContainer>
            <ChainSelect>
                <ChainIcon src={chainIcon} alt="Chain Icon" />
                <ChainName>Gnosis Chain</ChainName>
                <StyledDropdownIcon />
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
                                <IconButton onClick={() => searchTx(value)}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </SearchContainer>
    );
};

export default SearchBar;
