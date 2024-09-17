import TransactionSuccessGauge from '../../src/modules/TransactionGauge';
import { mount } from '@cypress/react18';
import { WebSocketContext } from '../../src/context/WebSocketContext';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

describe('<TransactionSuccessGauge />', () => {
    beforeEach(() => {
        cy.intercept('GET', '/inclusion_time/executed_transactions', {
            successful: 25,
            failed: 5,
        }).as('getExecutedTransactions');
    });

    it('renders and displays the transaction success gauge', () => {
        const mockSocket = {
            onopen: cy.stub(),
            onmessage: cy.stub(),
            onclose: cy.stub(),
            onerror: cy.stub(),
        };

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <MemoryRouter>
                    <TransactionSuccessGauge />
                </MemoryRouter>
            </WebSocketContext.Provider>
        );

        cy.get('svg')
            .find('tspan')
            .should('contain', '83.333')
            .should('be.visible'); // 25 / (25 + 5) * 100 = 83.333
    });

    it('receives updated transaction success data via WebSocket and updates the UI', () => {
        const mockSocket = {
            onopen: cy.stub(),
            onmessage: cy.stub(),
            onclose: cy.stub(),
            onerror: cy.stub(),
        };

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <MemoryRouter>
                    <TransactionSuccessGauge />
                </MemoryRouter>
            </WebSocketContext.Provider>
        );

        cy.wait('@getExecutedTransactions');

        // Simulate WebSocket event for updated transaction data
        cy.wrap(mockSocket).invoke('onmessage', {
            data: JSON.stringify({
                type: 'executed_transactions_updated',
                data: { successful: 30, failed: 5 },
            }),
        } as MessageEvent);

        cy.get('svg')
            .find('tspan')
            .should('contain', '85.714') // 30 / (30 + 5) * 100 = 85.714
            .should('be.visible');
    });

    it('displays an error message if fetching transaction stats fails', () => {
        cy.intercept('GET', '/inclusion_time/executed_transactions', {
            statusCode: 500,
            body: {},
        }).as('getExecutedTransactionsError');

        const mockSocket = {
            onopen: cy.stub(),
            onmessage: cy.stub(),
            onclose: cy.stub(),
            onerror: cy.stub(),
        };

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <MemoryRouter>
                    <TransactionSuccessGauge />
                </MemoryRouter>
            </WebSocketContext.Provider>
        );

        cy.wait('@getExecutedTransactionsError');

        cy.contains('Error fetching Transaction Stats').should('be.visible');
    });
});
