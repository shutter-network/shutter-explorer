import React from 'react';
import { SidebarContainer, SidebarNav, NavItem, NavIcon } from '../styles/sidebar';
import gridIcon from '../assets/icons/grid.svg';
import targetIcon from '../assets/icons/target.svg';
import arrowsIcon from '../assets/icons/arrows_horizontal.svg';

const navItems = [
    { icon: gridIcon, label: "System Overview" },
    { icon: targetIcon, label: "Slot Overview" },
    { icon: arrowsIcon, label: "Transactions" }
];

const Sidebar: React.FC = () => {
    return (
        <SidebarContainer>
            <SidebarNav>
                {navItems.map((item, index) => (
                    <NavItem key={index} to={'/' + item.label.toLowerCase().replace(' ', '-')}>
                        <NavIcon src={item.icon} alt={`${item.label} icon`} />
                        <span>{item.label}</span>
                    </NavItem>
                ))}
            </SidebarNav>
        </SidebarContainer>
    );
};

export default Sidebar;
