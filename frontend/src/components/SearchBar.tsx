import React, { FC, ChangeEvent } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
    placeholder: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
}

const SearchBar: FC<SearchBarProps> = ({ placeholder, value, onChange, onSubmit }) => {
    const navigate = useNavigate();

    const handleSearchSubmit = async () => {
        if (!value) return;

        try {
            const response = await fetch(`/api/txHash?hash=${value}`);
            if (response.ok) {
                const transactionData = await response.json();
                navigate('/transaction-detail', { state: transactionData });
            } else {
                console.error('Transaction not found');
            }
        } catch (error) {
            console.error('Error fetching transaction data:', error);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    return (
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
                            <IconButton onClick={handleSearchSubmit}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
};

export default SearchBar;
