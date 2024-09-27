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

export const StyledNavLinkEven = styled(NavLink)`
  color: blue; // Set the color for even rows
`;

export const StyledNavLinkOdd = styled(NavLink)`
  color: black; // Default color for odd rows
`;
