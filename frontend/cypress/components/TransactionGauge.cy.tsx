import TransactionGauge from '../../src/modules/TransactionGauge';
import { mount } from '@cypress/react18';
import { WebSocketContext } from '../../src/context/WebSocketContext';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { customTheme, muiTheme } from '../../src/theme';

describe('<TransactionGauge />', () => {
    it('renders the transaction gauge with test values', () => {
        const mockSocket = {
            onopen: cy.stub(),
            onmessage: cy.stub(),
            onclose: cy.stub(),
            onerror: cy.stub(),
        };

        cy.intercept('GET', '/api/inclusion_time/executed_transactions', {
            statusCode: 200,
            body: {
                message: {
                    Successful: 25,
                    Failed: 5,
                }
            },
        }).as('getExecutedTransactions');

        mount(
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

        cy.wait('@getExecutedTransactions');

        cy.get('div[role="meter"]').invoke('css', 'height', '300px');
        cy.get('div[role="meter"]').should('exist').and('be.visible');

        cy.contains('Shielded').should('be.visible');
        cy.contains('25').should('be.visible');

        cy.contains('Total').should('be.visible');
        cy.contains('30').should('be.visible');

        cy.contains('Unshielded').should('be.visible');
        cy.contains('5').should('be.visible');
    });
});
