import {ChangeEvent, ElementType, FC, ReactNode, useState} from 'react';
import { AppBar, Box, Container, CssBaseline, Drawer, List, ListItem, ListItemText, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

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
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" noWrap component="div">
                        Responsive Header
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {['System Overview', 'Slot Overview', 'Transaction Detail'].map((text, index) => (
                            <ListItem
                                button
                                component={RouterLink as ElementType}
                                to={"/" + text.toLowerCase().replace(' ', '-')}
                                key={index}
                            >
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <Toolbar />
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
    );
};

export default ResponsiveLayout;
