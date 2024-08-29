import {useEffect, useState} from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

interface Transaction {
    transactionHash: string;
}

export default function BasicTable() {
    const [rows, setRows] = useState<Transaction[]>([]);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetch('/data/transaction.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: Transaction[]) => setRows(data))
            .catch((error: Error) => setError(error));
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Transaction Hash</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.transactionHash}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
