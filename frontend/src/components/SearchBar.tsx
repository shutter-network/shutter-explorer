import React, { FC, useState } from 'react';
import { InputAdornment, IconButton, Box, Menu, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
    SearchContainer,
    ChainSelect,
    ChainIcon,
    StyledTextField,
    StyledDropdownIcon,
    StyledSearchIcon
} from '../styles/searchBar';
import chainIcon from '../assets/icons/gnosis.svg';
import Typography from '@mui/material/Typography';

interface SearchBarProps {
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: FC<SearchBarProps> = ({ placeholder, value, onChange }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
            {/* Chain Select with Dropdown */}
            <ChainSelect onClick={handleClick} id="chain-select">
                <Box display="flex" alignItems="center" gap={1}>
                    <ChainIcon src={chainIcon} alt="Chain Icon" />
                    <Typography variant="body1" sx={{ color: theme.palette.secondary.main }}>
                        Gnosis Chain
                    </Typography>
                </Box>
                <StyledDropdownIcon />
            </ChainSelect>

            {/* Dropdown Menu */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'chain-select',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            width: anchorEl ? anchorEl.clientWidth : 'auto',
                            border: '1px solid #ccced0',
                            borderRadius: '2px',
                            padding: 0,
                            backgroundColor: '#fff',
                            boxShadow: 'none',
                        },
                    },
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={handleClose}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <ChainIcon src={chainIcon} alt="Chain Icon" />
                        <Typography variant="body1" sx={{ color: theme.palette.secondary.main }}>
                            Gnosis Chain
                        </Typography>
                    </Box>
                </MenuItem>
            </Menu>

            {/* Search Input */}
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
                                    <StyledSearchIcon />
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