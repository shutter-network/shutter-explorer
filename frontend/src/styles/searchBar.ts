import styled from 'styled-components';
import { TextField } from '@mui/material';

export const SearchContainer = styled.div.attrs({
    className: 'search-container',
})`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;
  width: 100%;

  @media (max-width: 991px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const ChainSelect = styled.div.attrs({
    className: 'chain-select',
})`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #ccced0;
  border-radius: 2px;
  padding: 3px 6px;
  max-width: 240px;
  min-width: 240px;
  height: 40px;
`;

export const ChainIcon = styled.img.attrs({
    className: 'chain-icon',
})`
  width: 20px;
  height: 20px;
`;

export const ChainName = styled.span.attrs({
    className: 'chain-name',
})`
  flex: 1;
  padding: 0 4px;
  color: #051016;
  font: 600 14px/1 'Space Grotesk', sans-serif;
`;

export const DropdownIcon = styled.img.attrs({
    className: 'dropdown-icon',
})`
  width: 16px;
  height: 16px;
`;

export const StyledTextField = styled(TextField).attrs({
    className: 'styled-text-field',
})`
  && {
    max-width: 400px;
    width: 100%;
    height: 40px;
    background: #fff;
    border-radius: 2px;

    .MuiInputBase-root {
      padding: 3px 6px;
      height: 100%;
      border: 1px solid #ccced0;
      border-radius: 2px;
    }

    .MuiInputBase-input {
      font: 600 14px/1 'Space Grotesk', sans-serif;
      color: #989ca2;
    }
  }

  @media (max-width: 991px) {
    width: 100%;
  }
`;
