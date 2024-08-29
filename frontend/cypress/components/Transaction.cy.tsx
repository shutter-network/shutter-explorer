import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { mount } from 'cypress/react18';
import Transaction from '../../src/pages/Transaction';
import { transactionData, verifyTransactionDetails } from '../utils/transactionUtils';

describe('<Transaction />', () => {
    it('renders the transaction details correctly', () => {
        mount(
            <MemoryRouter initialEntries={[{ pathname: '/transaction-detail', state: transactionData }]}>
                <Routes>
                    <Route path="/transaction-detail" element={<Transaction />} />
                </Routes>
            </MemoryRouter>
        );

        // Check that each field is rendered correctly
        verifyTransactionDetails();
    });

    it('renders a message when no transaction data is found', () => {
        mount(
            <MemoryRouter initialEntries={['/transaction-detail']}>
                <Routes>
                    <Route path="/transaction-detail" element={<Transaction />} />
                </Routes>
            </MemoryRouter>
        );

        cy.contains('No transaction data found.').should('be.visible');
    });
});
