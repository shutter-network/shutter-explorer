import InclusionTime from '../../src/modules/InclusionTime';
import { mount } from '@cypress/react18';
import { WebSocketContext } from '../../src/context/WebSocketContext';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

describe('<InclusionTime />', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/inclusion_time/estimated_inclusion_time', { message: 10 }).as('getEstimatedInclusionTime');
        cy.intercept('GET', '/api/inclusion_time/executed_transactions', {
            message:{
                Successful: 25,
                Failed: 5
            }
        }).as('getExecutedTransactions');
        cy.intercept('GET', '/api/inclusion_time/historical_inclusion_time', {
            message: [
                { day: 1625097600, averageInclusionTime: 300 },
                { day: 1625184000, averageInclusionTime: 320 },
                { day: 1625270400, averageInclusionTime: 310 },
                { day: 1625356800, averageInclusionTime: 330 },
                { day: 1625443200, averageInclusionTime: 340 },
                { day: 1625529600, averageInclusionTime: 350 },
                { day: 1625616000, averageInclusionTime: 360 },
                { day: 1625702400, averageInclusionTime: 370 },
                { day: 1625788800, averageInclusionTime: 380 },
                { day: 1625875200, averageInclusionTime: 390 },
            ]
        }).as('getHistoricalInclusionTime');
    });

    it('renders and displays initial API data', () => {
        const mockSocket = {
            onopen: cy.stub(),
            onmessage: cy.stub(),
            onclose: cy.stub(),
            onerror: cy.stub(),
        };

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <MemoryRouter>
                    <InclusionTime />
                </MemoryRouter>
            </WebSocketContext.Provider>
        );

        cy.contains('Inclusion Time Overview').should('be.visible');
        cy.contains('Estimated Inclusion Time').should('be.visible');
        cy.contains('10 mins').should('be.visible');


        cy.contains('Transaction Success Rate').should('be.visible');
        cy.get('svg')
            .find('tspan')
            .should('contain', '83.333')
            .should('be.visible');

        cy.contains('Historical Inclusion Times').should('be.visible');
        cy.contains('300').should('be.visible');
        cy.contains('320').should('be.visible');
        cy.contains('340').should('be.visible');
        cy.contains('Fri 02').should('be.visible');
        cy.contains('Sat 03').should('be.visible');
    });

    it('displays loading states initially', () => {
        const mockSocket = {
            onopen: cy.stub(),
            onmessage: cy.stub(),
            onclose: cy.stub(),
            onerror: cy.stub(),
        };

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <InclusionTime />
            </WebSocketContext.Provider>
        );

        cy.contains('Loading...').should('exist');
    });

    it('receives updated inclusion time data via WebSocket and updates the UI', () => {
        const mockSocket = {
            onopen: cy.stub(),
            onmessage: cy.stub(),
            onclose: cy.stub(),
            onerror: cy.stub(),
        };

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <InclusionTime />
            </WebSocketContext.Provider>
        );

        cy.wait('@getEstimatedInclusionTime');
        cy.wait('@getExecutedTransactions');
        cy.wait('@getHistoricalInclusionTime');

        cy.wrap(mockSocket).invoke('onmessage', {
            data: JSON.stringify({
                type: 'estimated_inclusion_time_updated',
                data: { time: 12 },
            }),
        } as MessageEvent);

        cy.contains('12 mins').should('be.visible');

        cy.wrap(mockSocket).invoke('onmessage', {
            data: JSON.stringify({
                type: 'executed_transactions_updated',
                data: { successful: 30, failed: 5 },
            }),
        } as MessageEvent);


        cy.get('svg')
            .find('tspan')
            .should('contain', '85.714')
            .should('be.visible');

        cy.wrap(mockSocket).invoke('onmessage', {
            data: JSON.stringify({
                type: 'historical_inclusion_time_updated',
                data: { times: [{ day: 1625184000, averageInclusionTime: 320 }] },
            }),
        } as MessageEvent);

        cy.contains('320').should('be.visible');  // Based on how the line chart displays data
    });

    it('displays error messages if API call fails', () => {
        const mockSocket = {
            onopen: cy.stub(),
            onmessage: cy.stub(),
            onclose: cy.stub(),
            onerror: cy.stub(),
        };

        cy.intercept('GET', '/api/inclusion_time/estimated_inclusion_time', {
            statusCode: 500,
            body: {},
        }).as('getEstimatedInclusionTimeError');

        cy.intercept('GET', '/api/inclusion_time/executed_transactions', {
            statusCode: 500,
            body: {},
        }).as('getExecutedTransactionsError');

        cy.intercept('GET', '/api/inclusion_time/historical_inclusion_time', {
            statusCode: 500,
            body: {},
        }).as('getHistoricalInclusionTimeError');

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <InclusionTime />
            </WebSocketContext.Provider>
        );

        cy.wait('@getEstimatedInclusionTimeError');
        cy.wait('@getExecutedTransactionsError');
        cy.wait('@getHistoricalInclusionTimeError');

        cy.contains('Error fetching Estimated Inclusion Time').should('be.visible');
        cy.contains('Error fetching Transaction Stats').should('be.visible');
        cy.contains('Error fetching Historical Inclusion Time').should('be.visible');
    });

    it('displays WebSocket error message if WebSocket error occurs', () => {
        const mockSocket = {
            onopen: cy.stub(),
            onmessage: cy.stub(),
            onclose: cy.stub(),
            onerror: cy.stub(),
        };

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <InclusionTime />
            </WebSocketContext.Provider>
        );

        cy.wait('@getEstimatedInclusionTime');
        cy.wait('@getExecutedTransactions');
        cy.wait('@getHistoricalInclusionTime');

        // Simulate a WebSocket error
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
        };

        mount(
            <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                <InclusionTime />
            </WebSocketContext.Provider>
        );

        cy.wait('@getEstimatedInclusionTime');
        cy.wait('@getExecutedTransactions');
        cy.wait('@getHistoricalInclusionTime');

        // Simulate a WebSocket event with an error
        cy.wrap(mockSocket).invoke('onmessage', {
            data: JSON.stringify({
                type: 'estimated_inclusion_time_updated',
                data: null,
                error: { message: 'Invalid data received', code: 400 },
            }),
        } as MessageEvent);

        cy.get('div').contains('Error: Invalid data received (Code: 400)').should('be.visible');
    });
});
