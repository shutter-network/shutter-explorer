import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { mount } from 'cypress/react18';
import SearchBar from '../../src/components/SearchBar';
import Transaction from '../../src/pages/Transaction';
import { transactionData, verifyTransactionDetails } from '../utils/transactionUtils';

describe('<SearchBar />', () => {
    it('submits a search query and navigates to the transaction detail page', () => {
        cy.intercept('GET', `/api/transaction?hash=${transactionData.userTransactionHash}`, {
            statusCode: 200,
            body: transactionData,
        }).as('getTransaction');

        const TestComponent = () => {
            const [searchQuery, setSearchQuery] = React.useState('');
            const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => setSearchQuery(event.target.value);

            return (
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
                            path="/transaction-details"
                            element={<Transaction />}
                        />
                    </Routes>
                </MemoryRouter>
            );
        };

        // Mount the test component
        mount(<TestComponent />);

        // Simulate user interaction
        cy.get('input[placeholder="Search by Txn Hash"]').type(`${transactionData.userTransactionHash}{enter}`);

        // Wait for the API call to complete
        cy.wait('@getTransaction');

        // Verify the transaction details are displayed correctly
        verifyTransactionDetails();
    });
});
