import { MemoryRouter } from 'react-router-dom';
import Slot from '../../src/pages/Slot';
import { mount } from "cypress/react18";

describe('<Slot />', () => {
    const sequencerTransactions = [
        { hash: '0xb93d868f83d56a44d28728e37dfa2fd4866af4acb114c11a04c1d8d264b91508' },
        { hash: '0x140626ddb8cb9c9ac86572c2eb7a57d60a19ae70d3e1853eacb09964c8e4dad2' },
        { hash: '0xd719f5b9671a8e334e1366e9f41d5f05dbe213440a19d2d37ea1c670a0b2773f' },
        { hash: '0xcb30dd4ab702aa72694ec9fa1ff636c9627110ab9ec9570eb06755afd277f750' },
    ];

    const userTransactions = [
        { hash: '0xb93d868f83d56a44d28728e37dfa2fd4866af4acb114c11a04c1d8d264b91508', status: 'pending' },
        { hash: '0x140626ddb8cb9c9ac86572c2eb7a57d60a19ae70d3e1853eacb09964c8e4dad2', status: 'pending' },
        { hash: '0xd719f5b9671a8e334e1366e9f41d5f05dbe213440a19d2d37ea1c670a0b2773f', status: 'submitted' },
        { hash: '0xcb30dd4ab702aa72694ec9fa1ff636c9627110ab9ec9570eb06755afd277f750', status: 'included' },
    ];

    beforeEach(() => {
        cy.intercept('GET', '/api/transaction/latest_sequencer_transactions', {
            statusCode: 200,
            body: {
                transactions: sequencerTransactions,
            },
        }).as('getSequencerTransactions');

        cy.intercept('GET', '/api/transaction/latest_user_transactions', {
            statusCode: 200,
            body: {
                transactions: userTransactions,
            },
        }).as('getUserTransactions');
    });

    it('displays loading states initially', () => {
        mount(
            <MemoryRouter>
                <Slot />
            </MemoryRouter>
        );

        cy.contains('Loading...').should('exist');
    });

    it('displays sequencer transactions after loading', () => {
        mount(
            <MemoryRouter>
                <Slot />
            </MemoryRouter>
        );
        cy.wait('@getSequencerTransactions');

        cy.get('h6').contains('Sequencer Transactions').should('be.visible');
        sequencerTransactions.forEach(tx => {
            cy.get('td').contains(tx.hash, { timeout: 10000 }).should('be.visible');
        });
    });

    it('displays user transactions after loading', () => {
        mount(
            <MemoryRouter>
                <Slot />
            </MemoryRouter>
        );
        cy.wait('@getUserTransactions');

        cy.get('h6').contains('User Transactions').should('be.visible');
        userTransactions.forEach(tx => {
            cy.get('td').contains(tx.hash, { timeout: 10000 }).should('be.visible');
            cy.get('td').contains(tx.status, { timeout: 10000 }).should('be.visible');
        });
    });

    it('displays error messages if API call fails', () => {
        // Mock an error response for the sequencer transactions
        cy.intercept('GET', '/api/transaction/latest_sequencer_transactions', {
            statusCode: 500,
            body: {},
        }).as('getSequencerTransactionsError');

        cy.intercept('GET', '/api/transaction/latest_user_transactions', {
            statusCode: 500,
            body: {},
        }).as('getUserTransactionsError');

        mount(
            <MemoryRouter>
                <Slot />
            </MemoryRouter>
        );
        cy.wait('@getSequencerTransactionsError');
        cy.wait('@getUserTransactionsError');

        cy.get('div').contains('Error fetching sequencer transactions').should('be.visible');
        cy.get('div').contains('Error fetching user transactions').should('be.visible');
    });
});
