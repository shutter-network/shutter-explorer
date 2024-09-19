import { MemoryRouter } from 'react-router-dom';
import Slot from '../../src/pages/Slot';
import { mount } from "cypress/react18";
import React from 'react';
import { WebSocketContext } from '../../src/context/WebSocketContext';
import { getTimeAgo } from '../../src/utils/utils';
import { truncateString } from '../utils/transactionUtils';

describe('<Slot />', () => {
    const sequencerTransactions = [
        { SequencerTxHash: '0xb93d868f83d56a44d28728e37dfa2fd4866af4acb114c11a04c1d8d264b91508', CreatedAtUnix: 1725201600 },
        { SequencerTxHash: '0x140626ddb8cb9c9ac86572c2eb7a57d60a19ae70d3e1853eacb09964c8e4dad2', CreatedAtUnix: 1725201900 },
        { SequencerTxHash: '0xd719f5b9671a8e334e1366e9f41d5f05dbe213440a19d2d37ea1c670a0b2773f', CreatedAtUnix: 1725202200 },
        { SequencerTxHash: '0xcb30dd4ab702aa72694ec9fa1ff636c9627110ab9ec9570eb06755afd277f750', CreatedAtUnix: 1725202500 },
    ];

    const userTransactions = [
        { TxHash: '0xb93d868f83d56a44d28728e37dfa2fd4866af4acb114c11a04c1d8d264b91508', IncludedAtUnix: 1725202800 },
        { TxHash: '0x140626ddb8cb9c9ac86572c2eb7a57d60a19ae70d3e1853eacb09964c8e4dad2', IncludedAtUnix: 1725203100 },
        { TxHash: '0xd719f5b9671a8e334e1366e9f41d5f05dbe213440a19d2d37ea1c670a0b2773f', IncludedAtUnix: 1725203400 },
        { TxHash: '0xcb30dd4ab702aa72694ec9fa1ff636c9627110ab9ec9570eb06755afd277f750', IncludedAtUnix: 1725203700 },
    ];

    beforeEach(() => {
        cy.intercept('GET', '/api/transaction/latest_sequencer_transactions?limit=10', {
            statusCode: 200,
            body: {
                message: sequencerTransactions,
            },
        }).as('getSequencerTransactions');

        cy.intercept('GET', '/api/transaction/latest_user_transactions?limit=10', {
            statusCode: 200,
            body: {
                message: userTransactions,
            },
        }).as('getUserTransactions');
    });

    it('displays loading states initially', () => {
        const mockSocket = {
            onopen: cy.stub(),
            onmessage: cy.stub(),
            onclose: cy.stub(),
            onerror: cy.stub(),
            addEventListener: cy.stub(),
            removeEventListener: cy.stub(),
        };

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <MemoryRouter>
                    <Slot />
                </MemoryRouter>
            </WebSocketContext.Provider>
        );

        cy.contains('Loading...').should('exist');
    });

    it('displays sequencer transactions after loading', () => {
        const mockSocket = new EventTarget()

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <MemoryRouter>
                    <Slot />
                </MemoryRouter>
            </WebSocketContext.Provider>
        );
        cy.wait('@getSequencerTransactions');

        cy.get('h5').contains('Sequencer Transactions').should('be.visible');
        sequencerTransactions.forEach(tx => {
            cy.get('td').contains(truncateString(tx.SequencerTxHash, 50) , { timeout: 10000 }).should('be.visible');
            const expectedTimeAgo = getTimeAgo(tx.CreatedAtUnix);
            cy.get('td').contains(expectedTimeAgo, { timeout: 10000 }).should('be.visible');
        });
    });

    it('displays user transactions after loading', () => {
        const mockSocket = {
            onopen: cy.stub(),
            onmessage: cy.stub(),
            onclose: cy.stub(),
            onerror: cy.stub(),
            addEventListener: cy.stub(),
            removeEventListener: cy.stub(),
        };

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <MemoryRouter>
                    <Slot />
                </MemoryRouter>
            </WebSocketContext.Provider>
        );
        cy.wait('@getUserTransactions');

        cy.get('h5').contains('User Transactions').should('be.visible');
        userTransactions.forEach(tx => {
            cy.get('td').contains(truncateString(tx.TxHash, 50), { timeout: 10000 }).should('be.visible');
            const expectedTimeAgo = getTimeAgo(tx.IncludedAtUnix);
            cy.get('td').contains(expectedTimeAgo, { timeout: 10000 }).should('be.visible');
        });
    });

    it('displays error messages if API call fails', () => {
        const mockSocket = {
            onopen: cy.stub(),
            onmessage: cy.stub(),
            onclose: cy.stub(),
            onerror: cy.stub(),
            addEventListener: cy.stub(),
            removeEventListener: cy.stub(),
        };

        cy.intercept('GET', '/api/transaction/latest_sequencer_transactions?limit=10', {
            statusCode: 500,
            body: {},
        }).as('getSequencerTransactionsError');

        cy.intercept('GET', '/api/transaction/latest_user_transactions?limit=10', {
            statusCode: 500,
            body: {},
        }).as('getUserTransactionsError');

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <MemoryRouter>
                    <Slot />
                </MemoryRouter>
            </WebSocketContext.Provider>
        );
        cy.wait('@getSequencerTransactionsError');
        cy.wait('@getUserTransactionsError');

        cy.get('div').contains('Error fetching sequencer transactions').should('be.visible');
        cy.get('div').contains('Error fetching user transactions').should('be.visible');
    });

    it('receives a new array of transactions via WebSocket and updates the table', () => {
        const mockSocket = new EventTarget();

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <MemoryRouter>
                    <Slot />
                </MemoryRouter>
            </WebSocketContext.Provider>
        );

        cy.wait('@getSequencerTransactions');
        cy.wait('@getUserTransactions');

        const messageEvent1 = new MessageEvent('message', {
            data: JSON.stringify({
                type: 'sequencer_transactions_updated',
                data: [
                    { SequencerTxHash: '0xnewSequencerTransactionHash1', CreatedAtUnix: 1725204000 },
                    { SequencerTxHash: '0xnewSequencerTransactionHash2', CreatedAtUnix: 1725204300 },
                ],
            }),
          });

        cy.then(() => {
            // Dispatch the event to simulate the WebSocket message
            mockSocket.dispatchEvent(messageEvent1);
        });

        cy.get('td').contains('0xnewSequencerTransactionHash1', { timeout: 10000 }).should('be.visible');
        cy.get('td').contains(getTimeAgo(1725204000), { timeout: 10000 }).should('be.visible');
        cy.get('td').contains('0xnewSequencerTransactionHash2', { timeout: 10000 }).should('be.visible');
        cy.get('td').contains(getTimeAgo(1725204300), { timeout: 10000 }).should('be.visible');

        cy.wrap(mockSocket).invoke('onmessage', {
            data: JSON.stringify({
                type: 'user_transactions_updated',
                data: [
                    { TxHash: '0xnewUserTransactionHash1', IncludedAtUnix: 1725204600 },
                    { TxHash: '0xnewUserTransactionHash2', IncludedAtUnix: 1725204900 },
                ],
            }),
        } as MessageEvent);

        cy.get('td').contains('0xnewUserTransactionHash1', { timeout: 10000 }).should('be.visible');
        cy.get('td').contains(getTimeAgo(1725204600), { timeout: 10000 }).should('be.visible');
        cy.get('td').contains('0xnewUserTransactionHash2', { timeout: 10000 }).should('be.visible');
        cy.get('td').contains(getTimeAgo(1725204900), { timeout: 10000 }).should('be.visible');
    });

    it('displays a WebSocket error message if a WebSocket error occurs', () => {
        const mockSocket = {
            onopen: cy.stub(),
            onmessage: cy.stub(),
            onclose: cy.stub(),
            onerror: cy.stub(),
            addEventListener: cy.stub(),
            removeEventListener: cy.stub(),
        };

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <MemoryRouter>
                    <Slot />
                </MemoryRouter>
            </WebSocketContext.Provider>
        );

        cy.wait('@getSequencerTransactions');
        cy.wait('@getUserTransactions');

        cy.wrap(mockSocket).invoke('onerror', {
            message: 'WebSocket connection failed',
        });

        cy.get('div').contains('WebSocket error: A connection error occurred').should('be.visible');
    });

    it('displays an error message if WebSocket event contains an error', () => {
        const mockSocket = {
            onopen: cy.stub(),
            onmessage: cy.stub(),
            onclose: cy.stub(),
            onerror: cy.stub(),
            addEventListener: cy.stub(),
            removeEventListener: cy.stub(),
        };

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <MemoryRouter>
                    <Slot />
                </MemoryRouter>
            </WebSocketContext.Provider>
        );

        cy.wait('@getSequencerTransactions');
        cy.wait('@getUserTransactions');

        cy.wrap(mockSocket).invoke('onmessage', {
            data: JSON.stringify({
                type: 'sequencer_transactions_updated',
                data: null,
                error: { message: 'Invalid data received', code: 400 },
            }),
        } as MessageEvent);

        cy.get('div').contains('Error: Invalid data received (Code: 400)').should('be.visible');
    });
});
