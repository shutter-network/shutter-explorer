import Validator from '../../src/modules/Validator';
import { mount } from '@cypress/react18';

describe('<Validator />', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/validator/shutterized_validators', { count: 123 }).as('getShutterizedValidators');
    cy.intercept('GET', '/api/validator/validator_percentage', { percentage: 25 }).as('getValidatorPercentage');
    cy.intercept('GET', '/api/validator/total_validators', { total: 456 }).as('getTotalValidators');
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
