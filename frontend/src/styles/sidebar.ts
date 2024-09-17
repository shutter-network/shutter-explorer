import styled from 'styled-components';
import { NavLink as RouterLink } from 'react-router-dom';

export const SidebarContainer = styled.aside.attrs({
    className: 'sidebar-container',
})`
  background: #f7f9fb;
  padding: 16px 20px;
  min-width: 240px;
`;

export const SidebarNav = styled.nav.attrs({
    className: 'sidebar-nav',
})`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const NavItem = styled(RouterLink).attrs({
    className: 'nav-item',
})`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  border-radius: 2px;
  padding: 12px;
  font: 600 14px/1 'Space Grotesk', sans-serif;
  color: #989ca2;
  cursor: pointer;
  text-align: left;
  text-decoration: none;

  &:hover {
    color: #002861;
    background-color: #e0e0e0;
  }

  &.active {
    color: #002861;
    background-color: #e0e0e0;
  }
`;

export const NavIcon = styled.svg`
  width: 16px;
  height: 16px;
  filter: brightness(0) saturate(100%) invert(9%) sepia(50%) saturate(750%) hue-rotate(200deg) brightness(95%) contrast(85%);

  ${NavItem}:hover & {
    filter: brightness(0) saturate(100%) invert(12%) sepia(45%) saturate(1500%) hue-rotate(220deg) brightness(90%) contrast(95%);
  }

  ${NavItem}.active & {
    filter: brightness(0) saturate(100%) invert(12%) sepia(45%) saturate(1500%) hue-rotate(220deg) brightness(90%) contrast(95%);
  }
`;
