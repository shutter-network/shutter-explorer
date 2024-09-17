import Validator from '../../src/modules/Validator';
import { mount } from '@cypress/react18';
import { WebSocketContext } from '../../src/context/WebSocketContext';
import React from "react";
import {MemoryRouter} from "react-router-dom";

describe('<Validator />', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/validator/total_registered_validators', { message: 100 }).as('getShutterizedValidators');
    cy.intercept('GET', '/api/validator/total_gnosis_validators', { message: 400 }).as('getTotalValidators');
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
            <Validator />
          </MemoryRouter>
        </WebSocketContext.Provider>
    );

    cy.contains('Validator Overview').should('be.visible');
    cy.contains('# Shutterized Validators').should('be.visible');
    cy.contains('100').should('be.visible');
    cy.contains('Validator Percentage').should('be.visible');
    cy.contains('25%').should('be.visible');
    cy.contains('# Validators').should('be.visible');
    cy.contains('400').should('be.visible');
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
          <Validator />
        </WebSocketContext.Provider>
    );

    cy.contains('Loading...').should('exist');
  });

  it('receives updated validator data via WebSocket and updates the UI', () => {
    const mockSocket = {
      onopen: cy.stub(),
      onmessage: cy.stub(),
      onclose: cy.stub(),
      onerror: cy.stub(),
    };

    mount(
        <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
          <Validator />
        </WebSocketContext.Provider>
    );

    cy.wait('@getShutterizedValidators');
    cy.wait('@getTotalValidators');

    cy.wrap(mockSocket).invoke('onmessage', {
      data: JSON.stringify({
        type: 'shutterized_validators_updated',
        data: { count: 100 },
      }),
    } as MessageEvent);

    cy.contains('100').should('be.visible');

    
    cy.wrap(mockSocket).invoke('onmessage', {
      data: JSON.stringify({
        type: 'total_validators_updated',
        data: { count: 1000 },
      }),
    } as MessageEvent);
    
    cy.contains('10%').should('be.visible');
    cy.contains('1000').should('be.visible');
  });

  it('displays error messages if API call fails', () => {
    const mockSocket = {
      onopen: cy.stub(),
      onmessage: cy.stub(),
      onclose: cy.stub(),
      onerror: cy.stub(),
    };

    // Simulate API errors
    cy.intercept('GET', '/api/validator/total_registered_validators', {
      statusCode: 500,
      body: {},
    }).as('getShutterizedValidatorsError');

    cy.intercept('GET', '/api/validator/total_gnosis_validators', {
      statusCode: 500,
      body: {},
    }).as('getTotalValidatorsError');

    mount(
        <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
          <Validator />
        </WebSocketContext.Provider>
    );

    cy.wait('@getShutterizedValidatorsError');
    cy.wait('@getTotalValidatorsError');

    cy.get('div').contains('Error fetching shutterized validators').should('be.visible');
    cy.get('div').contains('Error fetching validator percentage').should('be.visible');
    cy.get('div').contains('Error fetching total validators').should('be.visible');
  });

});
