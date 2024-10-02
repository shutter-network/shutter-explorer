import { TableCell, TableRow, tableCellClasses } from '@mui/material';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#f5f5f5",
        color: "#f5f5f5",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: "#F7F9FB",
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    }
}));

export const StyledNavLink = styled(NavLink)`
  color: ${({ theme }) => theme.palette.primary.main};
  font-weight: 600;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;