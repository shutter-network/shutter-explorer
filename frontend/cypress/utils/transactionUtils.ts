export interface TransactionData {
    TxStatus: string;
    EstimatedInclusionTime: string;
    EffectiveInclusionTime: string;
    UserTxHash: string;
    SequencerTxHash: string;
    InclusionSlot: number;
}

export const transactionData: TransactionData = {
    TxStatus: 'submitted',
    EstimatedInclusionTime: '1725020096',
    EffectiveInclusionTime: '1725020096',
    UserTxHash: '0xf715b42e677aa376fd61b0337854315ab230ddc68bb88adbc1c14caa108e1e08',
    SequencerTxHash: '0xdc677e4e7da47ee0b67e1e059148627ac71195b36cfd987dd5e2ece9b58c2f94',
    InclusionSlot: 1001,
};

export const updatedTransactionData: TransactionData = {
    TxStatus: 'included',
    EstimatedInclusionTime: '1725020101',
    EffectiveInclusionTime: '1725020101',
    UserTxHash: '0xf715b42e677aa376fd61b0337854315ab230ddc68bb88adbc1c14caa108e1e08',
    SequencerTxHash: '0xdc677e4e7da47ee0b67e1e059148627ac71195b36cfd987dd5e2ece9b58c2f94',
    InclusionSlot: 1002,
};

export const explorerUrl = Cypress.env('REACT_APP_EXPLORER_URL') as string;

export const verifyTransactionDetails = (data: TransactionData): void => {
    cy.contains('Transaction Details').should('be.visible');
    cy.contains('Transaction Status').should('be.visible');
    cy.contains(data.TxStatus).should('be.visible');
    cy.contains('Estimated Inclusion Time').should('be.visible');
    cy.contains(data.EstimatedInclusionTime).should('be.visible');
    cy.contains('Effective Inclusion Time').should('be.visible');
    cy.contains(data.EffectiveInclusionTime).should('be.visible');
    cy.contains('Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.UserTxHash}"]`).should('be.visible');
    cy.contains('Sequencer Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.SequencerTxHash}"]`).should('be.visible');
    cy.contains('Inclusion Slot').should('be.visible');
    cy.contains(data.InclusionSlot.toString()).should('be.visible');
};

export function truncateString(str: string, num: number): string {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
}