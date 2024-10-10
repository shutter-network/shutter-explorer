import { Box, Table, TableBody, TableCell, TableHead, Tooltip } from "@mui/material";
import {
    StyledNavLink,
    StyledTableCell,
    StyledTableContainer,
    StyledTableHeadRow,
    StyledTableRow
} from "../styles/table";
import { ReactComponent as CopyIconBlue } from '../assets/icons/copy_blue.svg';
import { ReactComponent as CopyIconGrey } from '../assets/icons/copy_grey.svg';
import { truncateString } from "../utils/utils";
import React from "react";

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
        <StyledTableContainer>
            <Table aria-label="simple table">
                <TableHead>
                    <StyledTableHeadRow>
                        {columns.map((column) => (
                            <TableCell key={column.id}>
                                {column.label}
                            </TableCell>
                        ))}
                    </StyledTableHeadRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <StyledTableRow key={index}>
                            {columns.map((column) => (
                                <StyledTableCell key={column.id}>
                                    {
                                        column.id === "hash" ?
                                            <Box display="flex" alignItems="center" gap={1} justifyContent="space-between">
                                                <StyledNavLink to={`/transaction-details/${row[column.id]}`} onCopy={event => {
                                                    event.preventDefault();
                                                    event.clipboardData.setData("text/plain", row[column.id]);
                                                }}>
                                                    {isMobile ? truncateString(row[column.id], 35): truncateString(row[column.id], 60) }
                                                </StyledNavLink>
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
        </StyledTableContainer>
    );
}
