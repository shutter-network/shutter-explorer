import { TableCell, TableRow, tableCellClasses } from '@mui/material';
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
    '&:nth-of-type(odd)': {
        backgroundColor: "#f5f5f5",
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
