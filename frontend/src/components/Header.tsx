import { Box, Button } from '@mui/material';
import { navButtonStyles, navIconStyles, joinButtonStyles } from '../styles/header';
import logo from '../assets/shutter-logo.svg';
import chevronDown from '../assets/icons/chevron_down.svg'


const Header = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* Left Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '20px', md: '80px' }, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                <img
                    src={logo}
                    alt="Company Logo"
                    style={{ width: '132px', height: '32px', objectFit: 'contain' }}
                />

                <Box component="nav" sx={{ display: 'flex', gap: '8px' }}>
                    <Button sx={navButtonStyles}>
                        About
                        <img
                            src={chevronDown}
                            alt="Chevron Down"
                            style={navIconStyles}
                        />
                    </Button>
                    <Button sx={navButtonStyles}>
                        Products
                        <img
                            src={chevronDown}
                            alt="Chevron Down"
                            style={navIconStyles}
                        />
                    </Button>
                    <Button sx={navButtonStyles}>
                        Learn
                        <img
                            src={chevronDown}
                            alt="Chevron Down"
                            style={navIconStyles}
                        />
                    </Button>
                </Box>
            </Box>

            {/* Right Section */}
            <Button sx={joinButtonStyles}>Join movement</Button>
        </Box>
    );
};

export default Header;
