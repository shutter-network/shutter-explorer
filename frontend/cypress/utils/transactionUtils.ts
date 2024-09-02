export interface TransactionData {
    status: string;
    estimatedInclusionTime: string;
    effectiveInclusionTime: string;
    userTransactionHash: string;
    sequencerTransactionHash: string;
    inclusionSlot: number;
}

export const transactionData: TransactionData = {
    status: 'submitted',
    estimatedInclusionTime: '1725020096',
    effectiveInclusionTime: '1725020096',
    userTransactionHash: '0xf715b42e677aa376fd61b0337854315ab230ddc68bb88adbc1c14caa108e1e08',
    sequencerTransactionHash: '0xdc677e4e7da47ee0b67e1e059148627ac71195b36cfd987dd5e2ece9b58c2f94',
    inclusionSlot: 1001,
};

export const updatedTransactionData: TransactionData = {
    status: 'included',
    estimatedInclusionTime: '1725020101',
    effectiveInclusionTime: '1725020101',
    userTransactionHash: '0xf715b42e677aa376fd61b0337854315ab230ddc68bb88adbc1c14caa108e1e08',
    sequencerTransactionHash: '0xdc677e4e7da47ee0b67e1e059148627ac71195b36cfd987dd5e2ece9b58c2f94',
    inclusionSlot: 1002,
};

export const explorerUrl = Cypress.env('REACT_APP_EXPLORER_URL') as string;

export const verifyTransactionDetails = (data: TransactionData): void => {
    cy.contains('Transaction Details').should('be.visible');
    cy.contains('Transaction Status').should('be.visible');
    cy.contains(data.status).should('be.visible');
    cy.contains('Estimated Inclusion Time').should('be.visible');
    cy.contains(data.estimatedInclusionTime).should('be.visible');
    cy.contains('Effective Inclusion Time').should('be.visible');
    cy.contains(data.effectiveInclusionTime).should('be.visible');
    cy.contains('Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.userTransactionHash}"]`).should('be.visible');
    cy.contains('Sequencer Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.sequencerTransactionHash}"]`).should('be.visible');
    cy.contains('Inclusion Slot').should('be.visible');
    cy.contains(data.inclusionSlot.toString()).should('be.visible');
};

