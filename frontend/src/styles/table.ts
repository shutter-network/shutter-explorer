import {TableCell, TableRow, tableCellClasses, TableContainer} from '@mui/material';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginTop: theme.spacing(2),
    border: `0.5px solid ${theme.colors.gray}`,
    boxShadow: 'none',
    borderRadius: '4px',

    [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(1), // Reduce margin for smaller screens
        borderRadius: '2px', // Smaller border radius for mobile
    },
}));

export const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
    '& th': {
        borderBottom: 'none',
        color: theme.colors.gray,
        fontWeight: 600,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),

        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(0.5), // Reduce padding for mobile
            paddingBottom: theme.spacing(0.5), // Reduce padding for mobile
            fontSize: '12px', // Smaller font size for mobile
            width: '50px'
        },
    },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),

        [theme.breakpoints.down('sm')]: {
            fontSize: '12px', // Reduce font size for mobile
            paddingTop: theme.spacing(0.5), // Reduce padding for mobile
            paddingBottom: theme.spacing(0.5), // Reduce padding for mobile
        },
    },
}));


export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.colors.lightBlue,
    },
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