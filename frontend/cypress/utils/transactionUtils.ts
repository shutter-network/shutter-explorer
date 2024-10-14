import { formatSeconds, formatTimestamp } from "../../src/utils/utils";

export interface TransactionData {
    TxStatus: string;
    EstimatedInclusionTime: number;
    EffectiveInclusionTime: number;
    UserTxHash: string;
    SequencerTxHash: string;
    InclusionSlot: number;
    InclusionDelay: number;
    BlockNumber?: number;
    Sender?: string;
}

export const transactionData: TransactionData = {
    TxStatus: 'Submitted',
    EstimatedInclusionTime: 1725020096,
    EffectiveInclusionTime: 0,
    UserTxHash: '0xa061e12c2a2bb266d9c0b29c67306f7f214bda92d0c72d995bc1fcc98ca85701',
    SequencerTxHash: '0xdc677e4e7da47ee0b67e1e059148627ac71195b36cfd987dd5e2ece9b58c2f94',
    InclusionSlot: 0,
    InclusionDelay: 180,
    BlockNumber: 0,
};

export const pendingTransactionData: TransactionData = {
    TxStatus: 'Pending user transaction',
    EstimatedInclusionTime: 1725020096,
    EffectiveInclusionTime: 0,
    UserTxHash: '0xa061e12c2a2bb266d9c0b29c67306f7f214bda92d0c72d995bc1fcc98ca85701',
    SequencerTxHash: '0xdc677e4e7da47ee0b67e1e059148627ac71195b36cfd987dd5e2ece9b58c2f94',
    InclusionSlot: 1002,
    InclusionDelay: 180,
    BlockNumber: 36435079,
};

export const updatedTransactionData: TransactionData = {
    TxStatus: 'Shielded inclusion',
    EstimatedInclusionTime: 1725020096,
    EffectiveInclusionTime: 1725020096,
    UserTxHash: '0xa061e12c2a2bb266d9c0b29c67306f7f214bda92d0c72d995bc1fcc98ca85701',
    SequencerTxHash: '0xdc677e4e7da47ee0b67e1e059148627ac71195b36cfd987dd5e2ece9b58c2f94',
    InclusionSlot: 1002,
    InclusionDelay: 180,
    BlockNumber: 36435079,
};

export const explorerUrl = Cypress.env('REACT_APP_EXPLORER_URL') as string;

// TODO update uncommented parts after update to backend and frontend
export const verifySubmittedTransactionDetails = (data: TransactionData): void => {
    cy.contains('Transaction Details').should('be.visible');
    cy.contains('Transaction Status').should('be.visible');
    cy.contains(data.TxStatus).should('be.visible');
    //cy.contains('Estimated Inclusion Time').should('be.visible');
    //cy.contains(formatTimestamp(data.EstimatedInclusionTime)).should('be.visible');
    //cy.contains('Estimated Inclusion Delay').should('be.visible');
    //cy.contains(formatSeconds(data.InclusionDelay)).should('be.visible');
    cy.contains('Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.UserTxHash}"]`).should('be.visible');
    cy.contains('Sequencer Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.SequencerTxHash}"]`).should('be.visible');
    cy.contains('Inclusion Slot').should('be.visible');
    cy.contains("N/A").should('be.visible');

    if (data.BlockNumber
        && !data.TxStatus.includes('Pending user transaction')
        && !data.TxStatus.includes('Submitted')) {
        cy.contains('Block Number').should('be.visible');
        cy.get(`a[href*="${explorerUrl}/block/${data.BlockNumber}"]`).should('be.visible');
    } else {
        cy.contains('Block Number').should('not.exist');
    }
};

export const verifyPendingTransactionDetails = (data: TransactionData): void => {
    cy.contains('Transaction Details').should('be.visible');
    cy.contains('Transaction Status').should('be.visible');
    cy.contains(data.TxStatus).should('be.visible');
    //cy.contains('Estimated Inclusion Time').should('be.visible');
    //cy.contains(formatTimestamp(data.EstimatedInclusionTime)).should('be.visible');
    //cy.contains('Estimated Inclusion Delay').should('be.visible');
    //cy.contains(formatSeconds(data.InclusionDelay)).should('be.visible');
    cy.contains('Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.UserTxHash}"]`).should('be.visible');
    cy.contains('Sequencer Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.SequencerTxHash}"]`).should('be.visible');
    cy.contains('Inclusion Slot').should('be.visible');
    cy.contains(data.InclusionSlot.toString()).should('be.visible');

    if (data.BlockNumber
        && !data.TxStatus.includes('Pending user transaction')
        && !data.TxStatus.includes('Submitted')) {
        cy.contains('Block Number').should('be.visible');
        cy.get(`a[href*="${explorerUrl}/block/${data.BlockNumber}"]`).should('be.visible');
    } else {
        cy.contains('Block Number').should('not.exist');
    }
};


export const verifyTransactionDetailsUpdated = (data: TransactionData): void => {
    cy.contains('Transaction Details').should('be.visible');
    cy.contains('Transaction Status').should('be.visible');
    cy.contains(data.TxStatus).should('be.visible');
    cy.contains('Effective Inclusion Time').should('be.visible');
    cy.contains(formatTimestamp(data.EffectiveInclusionTime)).should('be.visible');
    cy.contains('Inclusion Delay').should('be.visible');
    cy.contains(formatSeconds(data.InclusionDelay)).should('be.visible');
    cy.contains('Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.UserTxHash}"]`).should('be.visible');
    cy.contains('Sequencer Transaction').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/tx/${data.SequencerTxHash}"]`).should('be.visible');
    cy.contains('Inclusion Slot').should('be.visible');
    cy.contains(data.InclusionSlot.toString()).should('be.visible');
    cy.contains('Block Number').should('be.visible');
    cy.get(`a[href*="${explorerUrl}/block/${data.BlockNumber}"]`).should('be.visible');
};
