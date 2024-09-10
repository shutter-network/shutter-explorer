import { ChangeEvent, FC, ReactNode, useState } from 'react';
import { AppBar, Box, CssBaseline, Toolbar, Container } from '@mui/material';
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

            <Box sx={{ display: 'flex', flexGrow: 1, paddingTop: '64px' }}>
                <Sidebar />

                <Box component="main" sx={mainStyles}>
                    <Container sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <SearchBar
                            placeholder="Search by Txn Hash"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Container>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default ResponsiveLayout;
