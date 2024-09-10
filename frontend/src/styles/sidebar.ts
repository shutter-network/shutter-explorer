import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

export const SidebarContainer = styled.aside`
    background: #f7f9fb;
    padding: 16px 20px;
    min-width: 240px;
`;

export const SidebarNav = styled.nav`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

export const NavItem = styled(RouterLink)`
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: none;
    border-radius: 2px;
    padding: 3px;
    font: 600 14px/1 'Space Grotesk', sans-serif;
    color: #989ca2;
    cursor: pointer;
    text-align: left;
    text-decoration: none;
    &:hover {
        color: black;
        background-color: #e0e0e0;
    }
`;

export const NavIcon = styled.img`
    width: 16px;
    height: 16px;
`;