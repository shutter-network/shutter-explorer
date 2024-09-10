import { ChangeEvent, ElementType, FC, ReactNode, useState } from 'react';
import { AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemText, Toolbar, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Header from './Header';  // Import the Header component
import SearchBar from './SearchBar';
import { drawerStyles, mainStyles } from '../styles/responsiveLayout';

const drawerWidth = 240;

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

            {/* AppBar stays at the top and spans the full width */}
            <AppBar position="fixed" sx={{ backgroundColor: '#0044a4', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    {/* Use Header component */}
                    <Header />
                </Toolbar>
            </AppBar>

            {/* Main content container that moves everything below the AppBar */}
            <Box sx={{ display: 'flex', flexGrow: 1, paddingTop: '64px' }}> {/* 64px is the height of the AppBar */}

                {/* Drawer is below the AppBar */}
                <Drawer
                    variant="permanent"
                    sx={drawerStyles(drawerWidth)}
                >
                    <Toolbar /> {/* Adds space below the AppBar */}
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            {['System Overview', 'Slot Overview', 'Transaction Detail'].map((text, index) => (
                                <ListItem
                                    button
                                    component={RouterLink as ElementType}
                                    to={'/' + text.toLowerCase().replace(' ', '-')}
                                    key={index}
                                >
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>

                {/* Main content area */}
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
