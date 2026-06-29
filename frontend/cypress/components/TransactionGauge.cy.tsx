import TransactionGauge from '../../src/modules/TransactionGauge';
import { mount } from '@cypress/react18';
import { WebSocketContext } from '../../src/context/WebSocketContext';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { customTheme, muiTheme } from '../../src/theme';

const mountGauge = () => {
    const mockSocket = {
        onopen: cy.stub(),
        onmessage: cy.stub(),
        onclose: cy.stub(),
        onerror: cy.stub(),
    };
    return mount(
        <MUIThemeProvider theme={muiTheme}>
            <StyledThemeProvider theme={customTheme}>
                <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                    <MemoryRouter>
                        <TransactionGauge />
                    </MemoryRouter>
                </WebSocketContext.Provider>
            </StyledThemeProvider>
        </MUIThemeProvider>
    );
};

describe('<TransactionGauge />', () => {
    it('renders the gauge with default 30-day window', () => {
        cy.intercept('GET', '/api/inclusion_time/executed_transactions_recent?days=30', {
            statusCode: 200,
            body: {
                message: {
                    Shielded: 25,
                    Unshielded: 5,
                    Total: 30
                }
            },
        }).as('getRecentTransactions');

        mountGauge();

        cy.wait('@getRecentTransactions');

        cy.get('div[role="meter"]').invoke('css', 'height', '300px');
        cy.get('div[role="meter"]').should('exist').and('be.visible');

        cy.contains('Last 30 days').should('be.visible');
        cy.contains('Shielded').should('be.visible');
        cy.contains('25').should('be.visible');
        cy.contains('Total').should('be.visible');
        cy.contains('30').should('be.visible');
        cy.contains('Unshielded').should('be.visible');
        cy.contains('5').should('be.visible');
    });

    it('switches to 7-day window when 7d button is clicked', () => {
        cy.intercept('GET', '/api/inclusion_time/executed_transactions_recent?days=30', {
            statusCode: 200,
            body: { message: { Shielded: 25, Unshielded: 5 } },
        });

        cy.intercept('GET', '/api/inclusion_time/executed_transactions_recent?days=7', {
            statusCode: 200,
            body: { message: { Shielded: 10, Unshielded: 2 } },
        }).as('get7DayTransactions');

        mountGauge();

        cy.contains('7d').click();
        cy.wait('@get7DayTransactions');

        cy.contains('Last 7 days').should('be.visible');
        cy.contains('10').should('be.visible');
        cy.contains('2').should('be.visible');
    });
});
