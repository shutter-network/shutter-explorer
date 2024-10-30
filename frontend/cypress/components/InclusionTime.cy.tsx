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
                Shielded: 25,
                Unshielded: 5,
                Total: 30
            }
        }).as('getExecutedTransactions');
        cy.intercept('GET', '/api/inclusion_time/historical_inclusion_time', {
            message: [

                { SubmissionDateUnix: 1625097600, AvgInclusionTimeSeconds: 300 },
                { SubmissionDateUnix: 1625184000, AvgInclusionTimeSeconds: 320 },
                { SubmissionDateUnix: 1625270400, AvgInclusionTimeSeconds: 310 },
                { SubmissionDateUnix: 1625356800, AvgInclusionTimeSeconds: 330 },
                { SubmissionDateUnix: 1625443200, AvgInclusionTimeSeconds: 340 },
                { SubmissionDateUnix: 1625529600, AvgInclusionTimeSeconds: 350 },
                { SubmissionDateUnix: 1625616000, AvgInclusionTimeSeconds: 360 },
                { SubmissionDateUnix: 1625702400, AvgInclusionTimeSeconds: 370 },
                { SubmissionDateUnix: 1625788800, AvgInclusionTimeSeconds: 380 },
                { SubmissionDateUnix: 1625875200, AvgInclusionTimeSeconds: 390 },
                { SubmissionDateUnix: 1625961600, AvgInclusionTimeSeconds: 310 },
                { SubmissionDateUnix: 1626048000, AvgInclusionTimeSeconds: 320 },
                { SubmissionDateUnix: 1626134400, AvgInclusionTimeSeconds: 330 },
                { SubmissionDateUnix: 1626220800, AvgInclusionTimeSeconds: 340 },
                { SubmissionDateUnix: 1626307200, AvgInclusionTimeSeconds: 350 },
                { SubmissionDateUnix: 1626393600, AvgInclusionTimeSeconds: 360 },
                { SubmissionDateUnix: 1626480000, AvgInclusionTimeSeconds: 370 },
                { SubmissionDateUnix: 1626566400, AvgInclusionTimeSeconds: 380 },
                { SubmissionDateUnix: 1626652800, AvgInclusionTimeSeconds: 390 },
                { SubmissionDateUnix: 1626739200, AvgInclusionTimeSeconds: 400 },
                { SubmissionDateUnix: 1626825600, AvgInclusionTimeSeconds: 310 },
                { SubmissionDateUnix: 1626912000, AvgInclusionTimeSeconds: 320 },
                { SubmissionDateUnix: 1626998400, AvgInclusionTimeSeconds: 330 },
                { SubmissionDateUnix: 1627084800, AvgInclusionTimeSeconds: 340 },
                { SubmissionDateUnix: 1627171200, AvgInclusionTimeSeconds: 350 },
                { SubmissionDateUnix: 1627257600, AvgInclusionTimeSeconds: 360 },
                { SubmissionDateUnix: 1627344000, AvgInclusionTimeSeconds: 370 },
                { SubmissionDateUnix: 1627430400, AvgInclusionTimeSeconds: 380 },
                { SubmissionDateUnix: 1627516800, AvgInclusionTimeSeconds: 390 },
                { SubmissionDateUnix: 1627603200, AvgInclusionTimeSeconds: 400 },
            ],
        }).as('getHistoricalInclusionTime');
    });

    it('renders and displays the historical inclusion time chart', () => {
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

        cy.wait('@getHistoricalInclusionTime');
        cy.wait(2000);
        cy.get('svg').should('exist').invoke('css', 'width', '1000px').invoke('css', 'height', '600px');
        cy.get('svg').should('be.visible');

        cy.contains('5m').should('be.visible');
        cy.contains('5m').should('be.visible');
        cy.contains('6m').should('be.visible');
        cy.contains('7 JUL').should('be.visible');
        cy.contains('13 JUL').should('be.visible');
    });

    it('receives updated historical inclusion time data via WebSocket', () => {
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

        cy.wait('@getHistoricalInclusionTime');

        cy.wrap(mockSocket).invoke('onmessage', {
            data: JSON.stringify({
                Type: 'historical_inclusion_time_updated',
                Data: { times: [{ SubmissionDateUnix: 1625184000, AvgInclusionTimeSeconds: 350 }] },
            }),
        } as MessageEvent);

        cy.contains('6m').should('be.visible');
    });

    it('displays error messages if API call fails', () => {
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

        cy.wait('@getHistoricalInclusionTimeError');

        cy.contains('Error fetching Historical Inclusion Time').should('be.visible');
    });
});
