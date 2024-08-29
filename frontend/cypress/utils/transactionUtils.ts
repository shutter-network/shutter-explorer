export interface TransactionData {
    status: string;
    estimatedInclusionTime: string;
    effectiveInclusionTime: string;
    userTransactionHash: string;
    encryptedTransactionHash: string;
    inclusionSlot: number;
}

export const transactionData: TransactionData = {
    status: 'included',
    estimatedInclusionTime: '2 minutes',
    effectiveInclusionTime: '1 minute',
    userTransactionHash: '0xf715b42e677aa376fd61b0337854315ab230ddc68bb88adbc1c14caa108e1e08',
    encryptedTransactionHash: '0xdc677e4e7da47ee0b67e1e059148627ac71195b36cfd987dd5e2ece9b58c2f94',
    inclusionSlot: 1001,
};

export const explorerUrl = Cypress.env('REACT_APP_EXPLORER_URL') as string;

export const verifyTransactionDetails = (): void => {
    cy.contains('Transaction Details').should('be.visible');
    cy.contains('Transaction Status').should('be.visible');
    cy.contains('included').should('be.visible');
    cy.contains('Estimated Inclusion Time').should('be.visible');
    cy.contains('2 minutes').should('be.visible');
    cy.contains('Effective Inclusion Time').should('be.visible');
    cy.contains('1 minute').should('be.visible');
    cy.contains('Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${transactionData.userTransactionHash}"]`).should('be.visible');
    cy.contains('Sequencer Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${transactionData.encryptedTransactionHash}"]`).should('be.visible');
    cy.contains('Inclusion Slot').should('be.visible');
    cy.contains('1001').should('be.visible');
};
