import React, { useState } from 'react';
import { Box } from '@mui/material';
import logo from '../assets/shutter-logo.svg';
import chevronRight from '../assets/icons/chevron_right.svg';
import {NavIcon, NavButton, JoinButton, StyledDropdownIcon} from "../styles/header";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorLearn, setAnchorLearn] = useState(null);
    const handleProductMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleLearnMenuOpen = (event: any) => {
        setAnchorLearn(event.currentTarget);
    };
    const handleProductMenuClose = () => {
        setAnchorEl(null);
    };
    const handleLearnMenuClose = () => {
        setAnchorLearn(null);
    };
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding:"1rem 2.5rem" }}>
            {/* Left Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '20px', md: '50px' }, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                <img
                    src={logo}
                    alt="Company Logo"
                    style={{ width: '132px', height: '32px', objectFit: 'contain' }}
                />

                <Box component="nav" sx={{ display: 'flex', gap: '8px' }}>
                    <div onMouseEnter={handleProductMenuOpen} onMouseLeave={handleProductMenuClose}>
                        <NavButton>
                            Products
                            <StyledDropdownIcon/>
                        </NavButton>
                        <Menu
                            id="dropdown-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleProductMenuClose}
                            MenuListProps={{
                            onMouseLeave: handleProductMenuClose,
                            }}
                            >
                            <MenuItem sx={{color: 'black'}} component="a" href='https://blog.shutter.network/shielded-trading/' target='_blank' rel="noopener noreferrer">
                                Shielded Trading
                                <NavIcon
                                    src={chevronRight}
                                    alt="Chevron Right"
                                />
                            </MenuItem>
                            <MenuItem sx={{color: 'black'}} component="a" href='https://blog.shutter.network/shielded-voting/' target='_blank' rel="noopener noreferrer">
                                Shielded Voting
                                <NavIcon
                                    src={chevronRight}
                                    alt="Chevron Right"
                                />
                            </MenuItem>
                        </Menu>
                    </div>
                    <div onMouseEnter={handleLearnMenuOpen} onMouseLeave={handleLearnMenuClose}>
                        <NavButton>
                            Learn
                            <StyledDropdownIcon/>
                        </NavButton>
                        <Menu
                            id="dropdown-menu"
                            anchorEl={anchorLearn}
                            open={Boolean(anchorLearn)}
                            onClose={handleLearnMenuClose}
                            MenuListProps={{
                            onMouseLeave: handleLearnMenuClose,
                            }}
                            >
                            <MenuItem sx={{color: 'black'}} component="a" href='https://blog.shutter.network/' target='_blank' rel="noopener noreferrer">
                                Blog
                                <NavIcon
                                    src={chevronRight}
                                    alt="Chevron Right"
                                />
                            </MenuItem>
                            <MenuItem sx={{color: 'black'}} component="a" href='https://github.com/shutter-network' target='_blank' rel="noopener noreferrer">
                                Github
                                <NavIcon
                                    src={chevronRight}
                                    alt="Chevron Right"
                                />
                            </MenuItem>
                        </Menu>
                    </div>
                    </Box>
            </Box>

            {/* Right Section */}
            <JoinButton>Join Movement</JoinButton>
        </Box>
    );
};

export default Header;
