import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../styles/table";

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
                                    {row[column.id]}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
