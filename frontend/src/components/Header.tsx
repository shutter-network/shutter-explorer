import React, { useEffect, useState } from 'react';
import { Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import logo from '../assets/shutter-logo.svg';
import chevronRight from '../assets/icons/chevron_right.svg';
import menuIcon from '../assets/icons/burger.svg'; // Add your burger icon here
import { NavIcon, NavButton, StyledDropdownIcon, MobileMenuItem, ScheduleDemo } from "../styles/header";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorLearn, setAnchorLearn] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

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

    const handleMobileToggle = () => {
        setMobileOpen(!mobileOpen); // Toggle mobile menu open state
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: "1rem 2.5rem" }}>
            {/* Left Section */}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '20px', md: '50px' }, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                <img
                    src={logo}
                    alt="Company Logo"
                    style={{ width: '132px', height: '32px', objectFit: 'contain' }}
                />

                {/* Desktop Navigation */}
                <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: '8px' }}>
                    <div onMouseEnter={handleProductMenuOpen} onMouseLeave={handleProductMenuClose}>
                        <NavButton>
                            Products
                            <StyledDropdownIcon />
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
                            <MenuItem sx={{ color: 'black' }} component="a" href='https://blog.shutter.network/shielded-trading/' target='_blank' rel="noopener noreferrer">
                                Shielded Trading
                                <NavIcon src={chevronRight} alt="Chevron Right" />
                            </MenuItem>
                            <MenuItem sx={{ color: 'black' }} component="a" href='https://blog.shutter.network/shielded-voting/' target='_blank' rel="noopener noreferrer">
                                Shielded Voting
                                <NavIcon src={chevronRight} alt="Chevron Right" />
                            </MenuItem>
                        </Menu>
                    </div>
                    <div onMouseEnter={handleLearnMenuOpen} onMouseLeave={handleLearnMenuClose}>
                        <NavButton>
                            Learn
                            <StyledDropdownIcon />
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
                            <MenuItem sx={{ color: 'black' }} component="a" href='https://blog.shutter.network/' target='_blank' rel="noopener noreferrer">
                                Blog
                                <NavIcon src={chevronRight} alt="Chevron Right" />
                            </MenuItem>
                            <MenuItem sx={{ color: 'black' }} component="a" href='https://github.com/shutter-network' target='_blank' rel="noopener noreferrer">
                                Github
                                <NavIcon src={chevronRight} alt="Chevron Right" />
                            </MenuItem>
                        </Menu>
                    </div>
                </Box>
            </Box>

            {/* Right Section */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <ScheduleDemo>Schedule a Demo</ScheduleDemo>
            </Box>

            {/* Mobile Navigation */}
            <IconButton
                sx={{ display: { xs: 'block', md: 'none' } }}
                onClick={handleMobileToggle}
            >
                <img src={menuIcon} alt="Menu Icon" style={{ width: '24px', height: '24px' }} />
            </IconButton>

            <Drawer
                anchor="top"
                open={mobileOpen}
                onClose={handleMobileToggle}
                PaperProps={{
                    sx: {
                        width: '100vw',
                        height: '100vh',
                    },
                }}
            >
                <Box
                    sx={{ width: '100%', padding: '2rem' }}
                    role="presentation"
                    onClick={handleMobileToggle}
                    onKeyDown={handleMobileToggle}
                >
                    {/* Mobile Nav Content */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <img
                            src={logo}
                            alt="Company Logo"
                            style={{ width: '132px', height: '32px', objectFit: 'contain' }}
                        />
                        <IconButton onClick={handleMobileToggle}>
                            <img src={menuIcon} alt="Close Icon" style={{ width: '24px', height: '24px' }} />
                        </IconButton>
                    </Box>
                    <List sx={{ marginTop: '2rem' }}>
                        <div>
                            <div style={{ color: "#05101680", textAlign: "left", letterSpacing: "-.05625rem", marginBottom: ".5rem", fontSize: "1.13rem", fontWeight: "600", lineHeight: "145%" }}>
                                Products
                            </div>
                            <MobileMenuItem href='https://blog.shutter.network/shielded-trading/' target='_blank' rel="noopener noreferrer"  >
                                Shielded Trading
                                <NavIcon src={chevronRight} alt="Chevron Right" />
                            </MobileMenuItem>
                            <MobileMenuItem href='https://blog.shutter.network/shielded-voting/' target='_blank' rel="noopener noreferrer">
                                Shielded Voting
                                <NavIcon src={chevronRight} alt="Chevron Right" />
                            </MobileMenuItem>
                        </div>

                        <div>
                            <div style={{ color: "#05101680", textAlign: "left", letterSpacing: "-.05625rem", marginBottom: ".5rem", fontSize: "1.13rem", fontWeight: "600", lineHeight: "145%" }}>
                                Learn
                            </div>
                            <MobileMenuItem href='https://blog.shutter.network/' target='_blank' rel="noopener noreferrer">
                                Blog
                                <NavIcon src={chevronRight} alt="Chevron Right" />
                            </MobileMenuItem>
                            <MobileMenuItem href='https://github.com/shutter-network' target='_blank' rel="noopener noreferrer">
                                Github
                                <NavIcon src={chevronRight} alt="Chevron Right" />
                            </MobileMenuItem>
                        </div>
                        <ScheduleDemo style={{ marginTop: "10px", display: "block", textAlign: "center" }}>Schedule a Demo</ScheduleDemo>
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Header;
