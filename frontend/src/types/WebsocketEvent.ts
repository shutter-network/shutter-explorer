interface ApiError {
    message: string;
    code: number;
}

interface PreviousShutterizedSlotDetails {
    slot_number: number;
    timestamp: number;
    included_transactions: number;
}

interface SlotProgression {
    epochs: any; // todo
}

export interface Transaction {
    TxHash: string;
    IncludedAtUnix: number;
    EventTxHash: string
}

export interface SequencerTransaction {
    SequencerTxHash: string;
    Sender: string;
    CreatedAtUnix: number
}

export interface HistoricalInclusionTimeResponse {
    SubmissionDateUnix: number;
    TotalTransactions: number;
    AvgInclusionTimeSeconds: number;
    MinInclusionTimeSeconds: number;
    MaxInclusionTimeSeconds: number;
}

interface SequencerTransactions {
    transactions: Array<SequencerTransaction>;
}

interface UserTransactions {
    transactions: Array<Transaction>;
}

interface TransactionsProtected {
    count: number;
}

interface ValueProtected {
    value: number;
}

interface SuccessRate {
    rate: number;
}

interface ShutterizedValidators {
    count: number;
}

interface ValidatorPercentage {
    percentage: number;
}

interface TotalValidators {
    count: number;
}

interface GnosisChainKeypers {
    count: number;
}

interface KeyperThreshold {
    threshold: number;
}

interface ExecutedTransactions {
    count: number;
}

interface ShutterizedTransactionsPerMonth {
    count: number;
}

interface ShutterizedTransactionPercentage {
    percentage: number;
}

interface EstimatedInclusionTime {
    time: number;
}

interface ExecutedTransactionStats {
    successful: number;
    failed: number;
}

export interface HistoricalInclusionTime {
    times: {
        day: number;
        averageInclusionTime: number;
    }[];
}

interface CurrentEpoch {
    epoch: number;
}

export interface WebsocketEvent {
    type:
        | 'previous_shutterized_slot_details_updated'
        | 'slot_progression_updated'
        | 'sequencer_transactions_updated'
        | 'user_transactions_updated'
        | 'transactions_protected_updated'
        | 'value_protected_updated'
        | 'success_rate_updated'
        | 'shutterized_validators_updated'
        | 'validator_percentage_updated'
        | 'total_validators_updated'
        | 'gnosis_chain_keypers_updated'
        | 'keyper_threshold_updated'
        | 'executed_transactions_updated'
        | 'shutterized_transactions_per_month_updated'
        | 'shutterized_transaction_percentage_updated'
        | 'estimated_inclusion_time_updated'
        | 'executed_transaction_stats_updated'
        | 'historical_inclusion_time_updated'
        | 'current_epoch_updated';
    data:
        | PreviousShutterizedSlotDetails
        | SlotProgression
        | SequencerTransactions
        | UserTransactions
        | TransactionsProtected
        | ValueProtected
        | SuccessRate
        | ShutterizedValidators
        | ValidatorPercentage
        | TotalValidators
        | GnosisChainKeypers
        | KeyperThreshold
        | ExecutedTransactions
        | ShutterizedTransactionsPerMonth
        | ShutterizedTransactionPercentage
        | EstimatedInclusionTime
        | ExecutedTransactionStats
        | HistoricalInclusionTime
        | CurrentEpoch
        | null;
    error?: ApiError | null;
}
