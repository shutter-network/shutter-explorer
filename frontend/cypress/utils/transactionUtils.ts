import { formatSeconds, formatTimestamp } from "../../src/utils/utils";

export interface TransactionData {
    TxStatus: string;
    InclusionTime: number | null;
    UserTxHash: string;
    SequencerTxHash: string;
    InclusionSlot: number | null;
    InclusionDelay: number | null;
    BlockNumber: number | null;
}

export const transactionData: TransactionData = {
    TxStatus: 'Submitted',
    InclusionTime: 1725020096,
    UserTxHash: '0xf715b42e677aa376fd61b0337854315ab230ddc68bb88adbc1c14caa108e1e08',
    SequencerTxHash: '0xdc677e4e7da47ee0b67e1e059148627ac71195b36cfd987dd5e2ece9b58c2f94',
    InclusionSlot: null,
    InclusionDelay:180,
    BlockNumber: null,
};

export const pendingTransactionData: TransactionData = {
    TxStatus: 'Pending user transaction',
    InclusionTime: 1725020096,
    UserTxHash: '0xa061e12c2a2bb266d9c0b29c67306f7f214bda92d0c72d995bc1fcc98ca85701',
    SequencerTxHash: '0xdc677e4e7da47ee0b67e1e059148627ac71195b36cfd987dd5e2ece9b58c2f94',
    InclusionSlot: null,
    InclusionDelay: 180,
    BlockNumber: null,
}; 

export const notIncludedTransactionData: TransactionData = {
    TxStatus: 'Not included',
    InclusionTime: 0,
    UserTxHash: '0xa061e12c2a2bb266d9c0b29c67306f7f214bda92d0c72d995bc1fcc98ca85701',
    SequencerTxHash: '0xdc677e4e7da47ee0b67e1e059148627ac71195b36cfd987dd5e2ece9b58c2f94',
    InclusionSlot: null,
    InclusionDelay: 0,
    BlockNumber: null,
}; 

export const updatedTransactionData: TransactionData = {
    TxStatus: 'Shielded inclusion',
    InclusionTime: 1725020101,
    UserTxHash: '0xf715b42e677aa376fd61b0337854315ab230ddc68bb88adbc1c14caa108e1e08',
    SequencerTxHash: '0xdc677e4e7da47ee0b67e1e059148627ac71195b36cfd987dd5e2ece9b58c2f94',
    InclusionSlot: 1002,
    InclusionDelay:185,
    BlockNumber: 34423143,
};

export const explorerUrl = Cypress.env('REACT_APP_EXPLORER_URL') as string;

export const verifySubmittedTransactionDetails = (data: TransactionData): void => {
    cy.contains('Transaction Details').should('be.visible');
    cy.contains('Transaction Status').should('be.visible');
    cy.contains(data.TxStatus).should('be.visible');
    cy.contains('Estimated Inclusion Time').should('be.visible');
    cy.contains(formatTimestamp(false, data.InclusionTime!)).should('be.visible');
    cy.contains('Estimated Inclusion Delay').should('be.visible');
    cy.contains(formatSeconds(data.InclusionDelay!)).should('be.visible');
    cy.contains('Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.UserTxHash}"]`).should('be.visible');
    cy.contains('Sequencer Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.SequencerTxHash}"]`).should('be.visible');
};

export const verifyPendingTransactionDetails = (data: TransactionData): void => {
    cy.contains('Transaction Details').should('be.visible');
    cy.contains('Transaction Status').should('be.visible');
    cy.contains(data.TxStatus).should('be.visible');
    cy.contains('Estimated Inclusion Time').should('be.visible');
    cy.contains(formatTimestamp(false, data.InclusionTime!)).should('be.visible');
    cy.contains('Estimated Inclusion Delay').should('be.visible');
    cy.contains(formatSeconds(data.InclusionDelay!)).should('be.visible');
    cy.contains('Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.UserTxHash}"]`).should('be.visible');
    cy.contains('Sequencer Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.SequencerTxHash}"]`).should('be.visible');
};


export const verifyTransactionDetailsUpdated = (data: TransactionData): void => {
    cy.contains('Transaction Details').should('be.visible');
    cy.contains('Transaction Status').should('be.visible');
    cy.contains(data.TxStatus).should('be.visible');
    cy.contains('Effective Inclusion Time').should('be.visible');
    cy.contains(formatTimestamp(true, data.InclusionTime!)).should('be.visible');
    cy.contains('Effective Inclusion Delay').should('be.visible');
    cy.contains(formatSeconds(data.InclusionDelay!)).should('be.visible');
    cy.contains('Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.UserTxHash}"]`).should('be.visible');
    cy.contains('Sequencer Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.SequencerTxHash}"]`).should('be.visible');
    cy.contains('Inclusion Slot').should('be.visible');
    cy.contains(data.InclusionSlot!.toString()).should('be.visible');
    cy.contains('Block Number').should('be.visible');
    cy.contains(data.BlockNumber!.toString()).should('be.visible');
};
