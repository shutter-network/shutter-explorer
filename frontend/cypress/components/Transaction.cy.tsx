import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { mount } from 'cypress/react18';
import Transaction from '../../src/pages/Transaction';
import { transactionData, updatedTransactionData, verifyTransactionDetails, verifyTransactionDetailsUpdated } from '../utils/transactionUtils';
import {customTheme, muiTheme} from "../../src/theme";
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';


describe('<Transaction />', () => {
    it('renders the transaction details correctly', () => {
        cy.intercept('GET', `/api/transaction/${transactionData.UserTxHash}`, {
            statusCode: 200,
            body: { message: transactionData },
        }).as('getTransaction');

        mount(
            <MUIThemeProvider theme={muiTheme}>
                <StyledThemeProvider theme={customTheme}>

                <MemoryRouter initialEntries={[`/transaction-details/${transactionData.UserTxHash}`]}>
                <Routes>
                    <Route path="/transaction-details/:txHash" element={<Transaction />} />
                </Routes>
            </MemoryRouter>
                </StyledThemeProvider>
            </MUIThemeProvider>
        );

        cy.wait('@getTransaction');
        verifyTransactionDetails(transactionData);
    });

    it('updates the transaction details after polling', () => {
        cy.intercept('GET', `/api/transaction/${transactionData.UserTxHash}`, {
            statusCode: 200,
            body: { message: transactionData },
        }).as('getTransaction');

        mount(
            <MUIThemeProvider theme={muiTheme}>
                <StyledThemeProvider theme={customTheme}>
                <MemoryRouter initialEntries={[`/transaction-details/${transactionData.UserTxHash}`]}>
                <Routes>
                    <Route path="/transaction-details/:txHash" element={<Transaction />} />
                </Routes>
            </MemoryRouter>
                </StyledThemeProvider>
            </MUIThemeProvider>

        );

        cy.wait('@getTransaction');
        verifyTransactionDetails(transactionData);

        cy.intercept('GET', `/api/transaction/${transactionData.UserTxHash}`, {
            statusCode: 200,
            body: { message: updatedTransactionData },
        }).as('getUpdatedTransaction');

        cy.wait('@getUpdatedTransaction', { timeout: 15000 });
        verifyTransactionDetailsUpdated(updatedTransactionData);
    });

    it('renders a message when no transaction data is found', () => {
        cy.intercept('GET', `/api/transaction/*`, {
            statusCode: 200,
            body: {
                message: null
            }
        }).as('getTransaction');

        mount(
            <MUIThemeProvider theme={muiTheme}>
                <StyledThemeProvider theme={customTheme}>

                <MemoryRouter initialEntries={['/transaction-details/invalid-hash']}>
                <Routes>
                    <Route path="/transaction-details/:txHash" element={<Transaction />} />
                </Routes>
            </MemoryRouter>
                </StyledThemeProvider>
            </MUIThemeProvider>
        );

        cy.wait('@getTransaction');
        cy.contains('No transaction data found.').should('be.visible');
    });
});
