import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';  // MemoryRouter for testing
import { mount } from 'cypress/react18';
import SearchBar from '../../src/components/SearchBar';
import Transaction from '../../src/pages/Transaction';
import { transactionData, verifyTransactionDetails } from '../utils/transactionUtils';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { muiTheme, customTheme } from '../../src/theme';

describe('<SearchBar /> and <Transaction /> data display test', () => {
    it('submits a search query and displays the correct transaction data', () => {
        const TestComponent = () => {
            const [searchQuery, setSearchQuery] = React.useState('');
            const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => setSearchQuery(event.target.value);

            return (
                <MUIThemeProvider theme={muiTheme}>
                    <StyledThemeProvider theme={customTheme}>
                        <MemoryRouter initialEntries={['/']}>
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <SearchBar
                                            placeholder="Search by Txn Hash"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    }
                                />
                                <Route
                                    path="/transaction-details/:txHash"
                                    element={<Transaction />}
                                />
                            </Routes>
                        </MemoryRouter>
                    </StyledThemeProvider>
                </MUIThemeProvider>
            );
        };

        const txHash = transactionData.UserTxHash;

        cy.intercept('GET', `/api/transaction/${txHash}`, {
            statusCode: 200,
            body: { message: transactionData },
        }).as('getTransaction');

        mount(<TestComponent />);

        cy.get('input[placeholder="Search by Txn Hash"]', { timeout: 10000 })
            .should('exist')
            .should('be.visible')
            .type(`${txHash}{enter}`, { force: true });

        cy.wait('@getTransaction');

        verifyTransactionDetails(transactionData);
    });
});