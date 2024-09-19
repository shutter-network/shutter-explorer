import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../styles/table";
import { ReactComponent as CopyIcon } from '../assets/icons/copy.svg';
import { truncateString } from "../utils/utils";

interface Column {
    id: string;
    label: string;
    minWidth?: number;
}

interface BasicTableProps<T> {
    rows: T[];
    columns: Column[];
}

export default function BasicTable<T extends { [key: string]: any }>({
    rows,
    columns,
}: BasicTableProps<T>) {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };
    return (
        <TableContainer component={Paper}>
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
                                            <Box display="flex" alignItems="center" gap={1}>
                                                {truncateString(row[column.id], 40)}
                                                <Tooltip title="copy" onClick={() => handleCopy(row[column.id])}>
                                                    <CopyIcon />
                                                </Tooltip>
                                            </Box>
                                            : row[column.id]
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
