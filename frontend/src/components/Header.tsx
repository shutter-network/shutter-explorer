import { Box } from '@mui/material';
import logo from '../assets/shutter-logo.svg';
import chevronDown from '../assets/icons/chevron_down.svg';
import {NavIcon, NavButton, JoinButton} from "../styles/header";

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
                    <NavButton>
                        About
                        <NavIcon
                            src={chevronDown}
                            alt="Chevron Down"
                        />
                    </NavButton>
                    <NavButton>
                        Products
                        <NavIcon
                            src={chevronDown}
                            alt="Chevron Down"
                        />
                    </NavButton>
                    <NavButton>
                        Learn
                        <NavIcon
                            src={chevronDown}
                            alt="Chevron Down"
                        />
                    </NavButton>
                </Box>
            </Box>

            {/* Right Section */}
            <JoinButton>Join movement</JoinButton>
        </Box>
    );
};

export default Header;
