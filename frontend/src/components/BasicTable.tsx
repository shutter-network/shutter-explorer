import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../styles/table";
import { ReactComponent as CopyIconBlue } from '../assets/icons/copy_blue.svg';
import { ReactComponent as CopyIconGrey } from '../assets/icons/copy_grey.svg';
import { truncateString } from "../utils/utils";
import { NavLink } from "react-router-dom";

interface Column {
    id: string;
    label: string;
    minWidth?: number;
}

interface BasicTableProps<T> {
    rows: T[];
    columns: Column[];
    isMobile: Boolean;
}

export default function BasicTable<T extends { [key: string]: any }>({
    rows,
    columns,
    isMobile
}: BasicTableProps<T>) {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };
    return (
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <StyledTableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {columns.map((column) => (
                                <StyledTableCell key={column.id}>
                                    {
                                        column.id === "hash" ?
                                            <Box display="flex" alignItems="centre" gap={1} justifyContent="space-between">
                                                <NavLink to={`/transaction-details/${row[column.id]}`} onCopy={event => {
                                                    event.preventDefault();
                                                    event.clipboardData.setData("text/plain", row[column.id]);
                                                }} style={index % 2 === 0 ? { color: "#656B73", textDecoration: "none" } : { color: "#0044A4", textDecoration: "none" }}>
                                                    {isMobile ? row[column.id] : truncateString(row[column.id], 55)}
                                                </NavLink>
                                                <Tooltip title="copy" onClick={() => handleCopy(row[column.id])}>
                                                    {index % 2 === 0 ? <CopyIconGrey /> : <CopyIconBlue />}
                                                </Tooltip>
                                            </Box>
                                            : <span style={{ fontWeight: "bold" }}> {row[column.id]}</span>
                                    }
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
