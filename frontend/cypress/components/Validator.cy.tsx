import React from 'react';
import Validator from '../../src/modules/Validator';
import { mount } from '@cypress/react18';

describe('<Validator />', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/shutterizedValidators', { count: 123 }).as('getShutterizedValidators');
    cy.intercept('GET', '/api/validatorPercentage', { percentage: 25 }).as('getValidatorPercentage');
    cy.intercept('GET', '/api/totalValidators', { total: 456 }).as('getTotalValidators');
  });

  it('renders', () => {
    mount(<Validator />);

    cy.contains('Validator Overview').should('be.visible');
    cy.contains('# Shutterized Validators').should('be.visible');
    cy.contains('123').should('be.visible');
    cy.contains('Validator Percentage').should('be.visible');
    cy.contains('25%').should('be.visible');
    cy.contains('# Validators').should('be.visible');
    cy.contains('456').should('be.visible');
  });
});
