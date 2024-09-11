import styled from 'styled-components';

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
  font-weight: 600;
  font-family: 'Space Grotesk', sans-serif;
  padding: 6px 16px;
  cursor: pointer;
  text-transform: none;
`;

export const NavIcon = styled.img.attrs({
    className: 'nav-icon',
})`
  width: 16px;
  height: 16px;
  object-fit: contain;
`;

export const JoinButton = styled.button.attrs({
    className: 'join-button',
})`
  background-color: #fde12d;
  color: #051016;
  padding: 6px 16px;
  border: none;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Space Grotesk', sans-serif;
  cursor: pointer;
  text-transform: none;
`;
