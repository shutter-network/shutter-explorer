import React from 'react';
import { SidebarContainer, SidebarNav, NavItem, NavIcon } from '../styles/sidebar';
import { ReactComponent as GridIcon } from '../assets/icons/grid.svg';
import { ReactComponent as TargetIcon } from '../assets/icons/target.svg';
import { ReactComponent as ArrowsIcon } from '../assets/icons/arrows_horizontal.svg';

const navItems = [
    { icon: GridIcon, label: "System Overview" },
    { icon: TargetIcon, label: "Slot Overview" },
    { icon: ArrowsIcon, label: "Transaction Lookup" }
];

const Sidebar: React.FC = () => {
    return (
        <SidebarContainer>
            <SidebarNav>
                {navItems.map((item, index) => (
                    <NavItem key={index} to={'/' + item.label.toLowerCase().replace(' ', '-')}>
                        <NavIcon as={item.icon} style={{ fill: '#0044A4' }} />
                        <span>{item.label}</span>
                    </NavItem>
                ))}
            </SidebarNav>
        </SidebarContainer>
    );
};

export default Sidebar;
