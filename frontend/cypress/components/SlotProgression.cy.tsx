import { MemoryRouter } from 'react-router-dom';
import SlotProgression from '../../src/modules/SlotProgression';
import { mount } from "cypress/react18";
import React from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { muiTheme, customTheme } from '../../src/theme';

describe('<SlotProgression />', () => {
    const gnosisGenesisTime = 1638993340;
    const slotDuration = 5;
    const slotsPerEpoch = 16;

    it('verifies slot states using explicit class names with controlled time', () => {
        const currentTime =  Date.now();
        cy.clock(currentTime);
        cy.stub(Date, 'now').returns(currentTime);
        const currentSlot = Math.floor((currentTime / 1000 - gnosisGenesisTime) / slotDuration);

        const mockSlots = Array.from({ length: slotsPerEpoch * 3 }, (_, i) => ({
            Slot: currentSlot - slotsPerEpoch + i,
            ValidatorIndex: 1000 + i,
            IsRegisteration: i % 2 == 0,
        }));

        cy.intercept('GET', '/api/slot/top_5_epochs', {
            statusCode: 200,
            body: {
                message: mockSlots,
            },
        }).as('getSlotData');

        mount(
            <MUIThemeProvider theme={muiTheme}>
                <StyledThemeProvider theme={customTheme}>
                    <MemoryRouter>
                        <SlotProgression />
                    </MemoryRouter>
                </StyledThemeProvider>
            </MUIThemeProvider>
        );

        cy.wait('@getSlotData').then(({ response }) => {
            if (!response?.body?.message) {
                throw new Error('API response is undefined or improperly structured');
            }

            const slotsData = response.body.message;

            cy.get('.slot-visualizer').should('exist').then(() => {
                cy.get('.slot-visualizer').find('.slot-block').each(($slot, index) => {
                    const slotData = slotsData[index];
                    cy.wrap($slot).as(`slot-${index}`);

                    if (slotData.Slot == currentSlot) {
                        cy.get(`@slot-${index}`).should('have.class', 'active');
                    } else if (slotData.Slot < currentSlot) {
                        cy.get(`@slot-${index}`).should('have.class', 'passed');
                    }

                    if (slotData.IsRegisteration) {
                        cy.get(`@slot-${index}`).should('have.class', 'shutterized');
                        cy.get(`@slot-${index}`).find('svg').should('exist');
                    }
                });
            });

            cy.tick(slotDuration * 1000);
            const newCurrentSlot = currentSlot + 1;

            cy.get('.slot-visualizer').find('.slot-block').each(($slot, index) => {
                const slotData = slotsData[index];
                cy.wrap($slot).as(`slot-${index}`);

                if (slotData.Slot === newCurrentSlot) {
                    cy.get(`@slot-${index}`).should('have.class', 'active');
                } else if (slotData.Slot < newCurrentSlot) {
                    cy.get(`@slot-${index}`).should('have.class', 'passed');
                }

                if (slotData.IsRegisteration) {
                    cy.get(`@slot-${index}`).should('have.class', 'shutterized');
                    cy.get(`@slot-${index}`).find('svg').should('exist');
                }
            });

        });
    });
});
