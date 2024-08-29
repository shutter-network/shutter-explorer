import {ChangeEvent, FC} from 'react';
import { TextField, Box } from '@mui/material';

interface SearchBarProps {
    placeholder?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    value: string;
}

const SearchBar: FC<SearchBarProps> = ({ placeholder = 'Search...', onChange, value }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <TextField
                id="search-bar"
                label={placeholder}
                variant="outlined"
                value={value}
                onChange={onChange}
                sx={{ width: '100%' }}
            />
        </Box>
    );
};

export default SearchBar;
