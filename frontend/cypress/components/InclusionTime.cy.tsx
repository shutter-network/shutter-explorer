import InclusionTime from '../../src/modules/InclusionTime';
import { mount } from '@cypress/react18';
import { WebSocketContext } from '../../src/context/WebSocketContext';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

describe('<InclusionTime />', () => {
    beforeEach(() => {
        cy.intercept('GET', '/inclusion_time/historical_inclusion_time', {
            times: [
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
                { day: 1625961600, averageInclusionTime: 310 },
                { day: 1626048000, averageInclusionTime: 320 },
                { day: 1626134400, averageInclusionTime: 330 },
                { day: 1626220800, averageInclusionTime: 340 },
                { day: 1626307200, averageInclusionTime: 350 },
                { day: 1626393600, averageInclusionTime: 360 },
                { day: 1626480000, averageInclusionTime: 370 },
                { day: 1626566400, averageInclusionTime: 380 },
                { day: 1626652800, averageInclusionTime: 390 },
                { day: 1626739200, averageInclusionTime: 400 },
                { day: 1626825600, averageInclusionTime: 310 },
                { day: 1626912000, averageInclusionTime: 320 },
                { day: 1626998400, averageInclusionTime: 330 },
                { day: 1627084800, averageInclusionTime: 340 },
                { day: 1627171200, averageInclusionTime: 350 },
                { day: 1627257600, averageInclusionTime: 360 },
                { day: 1627344000, averageInclusionTime: 370 },
                { day: 1627430400, averageInclusionTime: 380 },
                { day: 1627516800, averageInclusionTime: 390 },
                { day: 1627603200, averageInclusionTime: 400 },
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

        cy.contains('300').should('be.visible');
        cy.contains('320').should('be.visible');
        cy.contains('340').should('be.visible');
        cy.contains('Wed 07').should('be.visible');
        cy.contains('Jul 11').should('be.visible');
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
                type: 'historical_inclusion_time_updated',
                data: { times: [{ day: 1625184000, averageInclusionTime: 350 }] },
            }),
        } as MessageEvent);

        cy.contains('350').should('be.visible');
    });

    it('displays an error message if fetching historical inclusion time fails', () => {
        cy.intercept('GET', '/inclusion_time/historical_inclusion_time', {
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
