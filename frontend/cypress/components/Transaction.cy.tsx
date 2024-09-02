import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { mount } from 'cypress/react18';
import Transaction from '../../src/pages/Transaction';
import {transactionData, updatedTransactionData, verifyTransactionDetails} from '../utils/transactionUtils';

describe('<Transaction />', () => {
    it('renders the transaction details correctly', () => {
        cy.intercept('GET', '/api/transaction?hash=*', {
            statusCode: 200,
            body: transactionData,
        }).as('getTransaction');

        mount(
            <MemoryRouter initialEntries={[{ pathname: '/transaction-details', state: transactionData }]}>
                <Routes>
                    <Route path="/transaction-details" element={<Transaction />} />
                </Routes>
            </MemoryRouter>
        );

        verifyTransactionDetails(transactionData);
    });

    it('updates the transaction details after polling', () => {
        cy.intercept('GET', `/api/transaction?hash=${transactionData.userTransactionHash}`, {
            statusCode: 200,
            body: updatedTransactionData,
        }).as('getUpdatedTransaction');

        mount(
            <MemoryRouter initialEntries={[{ pathname: '/transaction-details', state: transactionData }]}>
                <Routes>
                    <Route path="/transaction-details" element={<Transaction />} />
                </Routes>
            </MemoryRouter>
        );

        verifyTransactionDetails(transactionData);

        cy.wait('@getUpdatedTransaction');

        verifyTransactionDetails(updatedTransactionData);
    });


    it('renders a message when no transaction data is found', () => {
        mount(
            <MemoryRouter initialEntries={['/transaction-details']}>
                <Routes>
                    <Route path="/transaction-details" element={<Transaction />} />
                </Routes>
            </MemoryRouter>
        );

        cy.contains('No transaction data found.').should('be.visible');
    });
});
