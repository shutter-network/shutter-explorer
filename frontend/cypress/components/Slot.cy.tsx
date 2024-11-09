import { MemoryRouter } from 'react-router-dom';
import Slot from '../../src/pages/Slot';
import { mount } from "cypress/react18";
import React from 'react';
import { WebSocketContext } from '../../src/context/WebSocketContext';
import { getTimeAgo, getTimeDiff, truncateString } from '../../src/utils/utils';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { muiTheme, customTheme } from '../../src/theme';


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
            <MUIThemeProvider theme={muiTheme}>
                <StyledThemeProvider theme={customTheme}>
                    <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                        <MemoryRouter>
                            <Slot />
                        </MemoryRouter>
                    </WebSocketContext.Provider>
                </StyledThemeProvider>
            </MUIThemeProvider>
        );

        cy.contains('Loading...').should('exist');
    });

    it('displays sequencer transactions after loading', () => {
        const mockSocket = new EventTarget()

        mount(
            <MUIThemeProvider theme={muiTheme}>
                <StyledThemeProvider theme={customTheme}>
                    <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                        <MemoryRouter>
                            <Slot />
                        </MemoryRouter>
                    </WebSocketContext.Provider>
                </StyledThemeProvider>
            </MUIThemeProvider>
        );
        cy.wait('@getSequencerTransactions');

        cy.get('h5').contains('Sequencer Transactions').should('be.visible');
        sequencerTransactions.forEach(tx => {
            cy.get('a').should('contain.text', tx.SequencerTxHash.substring(0, 55)).and('contain.text', '...');
            const expectedTimeAgo = getTimeAgo(tx.CreatedAtUnix);
            cy.get('td').contains(expectedTimeAgo).should('be.visible');
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
            <MUIThemeProvider theme={muiTheme}>
                <StyledThemeProvider theme={customTheme}>
                    <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                        <MemoryRouter>
                            <Slot />
                        </MemoryRouter>
                    </WebSocketContext.Provider>
                </StyledThemeProvider>
            </MUIThemeProvider>
        );
        cy.wait('@getUserTransactions');

        cy.get('h5').contains('User Transactions').should('be.visible');
        userTransactions.forEach(tx => {
            cy.get('a').should('contain.text', tx.TxHash.substring(0, 55)).and('contain.text', '...');
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
            <MUIThemeProvider theme={muiTheme}>
                <StyledThemeProvider theme={customTheme}>
                    <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                        <MemoryRouter>
                            <Slot />
                        </MemoryRouter>
                    </WebSocketContext.Provider>
                </StyledThemeProvider>
            </MUIThemeProvider>
        );
        cy.wait('@getSequencerTransactionsError');
        cy.wait('@getUserTransactionsError');

        cy.get('div').contains('Error fetching sequencer transactions').should('be.visible');
        cy.get('div').contains('Error fetching user transactions').should('be.visible');
    });

    it('receives a new array of transactions via WebSocket and updates the table', () => {
        const mockSocket = new EventTarget();

        mount(
            <MUIThemeProvider theme={muiTheme}>
                <StyledThemeProvider theme={customTheme}>
                    <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                        <MemoryRouter>
                            <Slot />
                        </MemoryRouter>
                    </WebSocketContext.Provider>
                </StyledThemeProvider>
            </MUIThemeProvider>
        );

        cy.wait('@getSequencerTransactions');
        cy.wait('@getUserTransactions');

        const messageEvent1 = new MessageEvent('message', {
            data: JSON.stringify({
                Type: 'latest_sequencer_transactions_updated',
                Data: [
                    { SequencerTxHash: '0xnewSequencerTransactionHash1', CreatedAtUnix: 1725204000 },
                    { SequencerTxHash: '0xnewSequencerTransactionHash2', CreatedAtUnix: 1725204300 },
                ],
            }),
        });

        cy.then(() => {
            mockSocket.dispatchEvent(messageEvent1);
        });

        cy.get('td').contains('0xnewSequencerTransactionHash1', { timeout: 10000 }).should('be.visible');
        cy.get('td').contains(getTimeAgo(1725204000), { timeout: 10000 }).should('be.visible');
        cy.get('td').contains('0xnewSequencerTransactionHash2', { timeout: 10000 }).should('be.visible');
        cy.get('td').contains(getTimeAgo(1725204300), { timeout: 10000 }).should('be.visible');

        const messageEvent2 = new MessageEvent('message', {
            data: JSON.stringify({
                Type: 'latest_user_transactions_updated',
                Data: [
                    { TxHash: '0xnewUserTransactionHash1', IncludedAtUnix: 1725204600 },
                    { TxHash: '0xnewUserTransactionHash2', IncludedAtUnix: 1725204900 },
                ],
            }),
        });

        cy.then(() => {
            mockSocket.dispatchEvent(messageEvent2);
        });

        cy.get('td').contains('0xnewUserTransactionHash1', { timeout: 10000 }).should('be.visible');
        cy.get('td').contains(getTimeAgo(1725204600), { timeout: 10000 }).should('be.visible');
        cy.get('td').contains('0xnewUserTransactionHash2', { timeout: 10000 }).should('be.visible');
        cy.get('td').contains(getTimeAgo(1725204900), { timeout: 10000 }).should('be.visible');
    });

    it('receives a new array of transactions via WebSocket and updates the refresh timer', () => {
        cy.clock(Date.now());

        const mockSocket = new EventTarget();

        mount(
            <MUIThemeProvider theme={muiTheme}>
                <StyledThemeProvider theme={customTheme}>
                    <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
                        <MemoryRouter>
                            <Slot />
                        </MemoryRouter>
                    </WebSocketContext.Provider>
                </StyledThemeProvider>
            </MUIThemeProvider>
        );

        cy.wait('@getSequencerTransactions');
        cy.wait('@getUserTransactions');

        cy.get('span').contains("< 1M AGO").should('be.visible');

        cy.tick(60000);

        cy.get('span').contains("1M AGO").should('be.visible');


        const messageEvent1 = new MessageEvent('message', {
            data: JSON.stringify({
                Type: 'latest_sequencer_transactions_updated',
                Data: [
                    { SequencerTxHash: '0xnewSequencerTransactionHash1', CreatedAtUnix: 1725204000 },
                    { SequencerTxHash: '0xnewSequencerTransactionHash2', CreatedAtUnix: 1725204300 },
                ],
            }),
        });

        cy.then(() => {
            mockSocket.dispatchEvent(messageEvent1);
        });

        cy.get('span').contains("< 1M AGO").should('be.visible');

        const messageEvent2 = new MessageEvent('message', {
            data: JSON.stringify({
                Type: 'latest_user_transactions_updated',
                Data: [
                    { TxHash: '0xnewUserTransactionHash1', IncludedAtUnix: 1725204600 },
                    { TxHash: '0xnewUserTransactionHash2', IncludedAtUnix: 1725204900 },
                ],
            }),
        });

        cy.tick(120000);

        cy.get('span').contains("2M AGO").should('be.visible');

        cy.then(() => {
            mockSocket.dispatchEvent(messageEvent2);
        });

        cy.get('span').contains("< 1M AGO").should('be.visible');
    });
});
