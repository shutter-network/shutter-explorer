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
      addEventListener: cy.stub(),
      removeEventListener: cy.stub(),
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
      addEventListener: cy.stub(),
      removeEventListener: cy.stub(),
    };

    mount(
        <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
          <Validator />
        </WebSocketContext.Provider>
    );

    cy.contains('Loading...').should('exist');
  });

  it('receives updated validator data via WebSocket and updates the UI', () => {
    const mockSocket = new EventTarget();

    mount(
        <WebSocketContext.Provider value={{ socket: mockSocket as unknown as WebSocket }}>
          <Validator />
        </WebSocketContext.Provider>
    );

    cy.wait('@getShutterizedValidators');
    cy.wait('@getTotalValidators');

    const messageEvent1 = new MessageEvent('message', {
      data: JSON.stringify({
        Type: 'shutterized_validators_updated',
        Data: { count: 100 },
      }),
    });
  
    cy.then(() => {
      // Dispatch the event to simulate the WebSocket message
      mockSocket.dispatchEvent(messageEvent1);
    });

    cy.contains('100').should('be.visible');
    
    const messageEvent2 = new MessageEvent('message', {
      data: JSON.stringify({
        Type: 'total_validators_updated',
        Data: { count: 1000 },
      }),
    });
  
    cy.then(() => {
      // Dispatch the event to simulate the WebSocket message
      mockSocket.dispatchEvent(messageEvent2);
    });

    cy.contains('10%').should('be.visible');
    cy.contains('1000').should('be.visible');
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
