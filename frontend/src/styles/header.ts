import styled from 'styled-components';
import { ReactComponent as DropdownIcon } from '../assets/icons/chevron_down.svg';

export const StyledDropdownIcon = styled(DropdownIcon)`
  width: 16px;
  height: 16px;
  fill: #FFFFFF;
`;
export const NavButton = styled.button.attrs({
  className: 'nav-button',
})`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: transparent;
  border: none;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Space Grotesk', sans-serif;
  padding: 6px 16px;
  cursor: pointer;
  text-transform: none;
  font-size: 1rem;
`;

export const NavIcon = styled.img.attrs({
  className: 'nav-icon',
})`
  width: 16px;
  height: 16px;
  object-fit: contain;
`;

export const JoinButton = styled.a.attrs({
  className: 'join-button',
  href: "https://surveys.shutter.network/takebackcrypto",
  target: '_blank',
})`
  background-color: #fde12d;
  color: #051016;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 2px;
  font-size: 1.13rem;
  font-weight: bold;
  font-family: 'Space Grotesk', sans-serif;
  cursor: pointer;
  text-transform: none;
  letter-spacing:-.05625rem;
  line-height: 145%;
  text-decoration: none;
`;
