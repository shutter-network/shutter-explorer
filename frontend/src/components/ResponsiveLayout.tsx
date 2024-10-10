import { ChangeEvent, FC, ReactNode, useState } from 'react';
import { AppBar, Box, CssBaseline, Toolbar } from '@mui/material';
import Header from './Header';
import SearchBar from './SearchBar';
import Sidebar from './Sidebar';
import { mainStyles } from '../styles/responsiveLayout';

interface ResponsiveLayoutProps {
    children: ReactNode;
}

const ResponsiveLayout: FC<ResponsiveLayoutProps> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <CssBaseline />

            <AppBar position="fixed" sx={{ backgroundColor: '#0044a4', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Header />
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', flexGrow: 1, paddingTop: '78px' }}>
                <Sidebar />

                <Box component="main" sx={mainStyles}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2, padding: 0 }}>
                        <SearchBar
                            placeholder="Search by Txn Hash"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Box>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default ResponsiveLayout;
