// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: shutter_explorer.sql

package data

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const queryDecryptedTXForEncryptedTX = `-- name: QueryDecryptedTXForEncryptedTX :many
SELECT 
    dt.tx_hash, dt.tx_status,
    tse.encrypted_transaction,
    dk.key
FROM decrypted_tx dt 
INNER JOIN transaction_submitted_event tse ON dt.transaction_submitted_event_id = tse.id
INNER JOIN decryption_key dk ON dt.decryption_key_id = dk.id
WHERE tse.encrypted_transaction = $1
`

type QueryDecryptedTXForEncryptedTXRow struct {
	TxHash               []byte
	TxStatus             TxStatusVal
	EncryptedTransaction []byte
	Key                  []byte
}

func (q *Queries) QueryDecryptedTXForEncryptedTX(ctx context.Context, encryptedTransaction []byte) ([]QueryDecryptedTXForEncryptedTXRow, error) {
	rows, err := q.db.Query(ctx, queryDecryptedTXForEncryptedTX, encryptedTransaction)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []QueryDecryptedTXForEncryptedTXRow
	for rows.Next() {
		var i QueryDecryptedTXForEncryptedTXRow
		if err := rows.Scan(
			&i.TxHash,
			&i.TxStatus,
			&i.EncryptedTransaction,
			&i.Key,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const queryExecutedTransactionStats = `-- name: QueryExecutedTransactionStats :many
SELECT COUNT(id), tx_status FROM decrypted_tx
GROUP BY tx_status
`

type QueryExecutedTransactionStatsRow struct {
	Count    int64
	TxStatus TxStatusVal
}

func (q *Queries) QueryExecutedTransactionStats(ctx context.Context) ([]QueryExecutedTransactionStatsRow, error) {
	rows, err := q.db.Query(ctx, queryExecutedTransactionStats)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []QueryExecutedTransactionStatsRow
	for rows.Next() {
		var i QueryExecutedTransactionStatsRow
		if err := rows.Scan(&i.Count, &i.TxStatus); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const queryFromTransactionDetails = `-- name: QueryFromTransactionDetails :one
SELECT tx_hash as user_tx_hash, encrypted_tx_hash
FROM transaction_details 
WHERE tx_hash = $1 OR encrypted_tx_hash = $1
ORDER BY submission_time DESC
LIMIT 1
`

type QueryFromTransactionDetailsRow struct {
	UserTxHash      string
	EncryptedTxHash string
}

func (q *Queries) QueryFromTransactionDetails(ctx context.Context, txHash string) (QueryFromTransactionDetailsRow, error) {
	row := q.db.QueryRow(ctx, queryFromTransactionDetails, txHash)
	var i QueryFromTransactionDetailsRow
	err := row.Scan(&i.UserTxHash, &i.EncryptedTxHash)
	return i, err
}

const queryGreeter = `-- name: QueryGreeter :many
SELECT hello from greeter
`

func (q *Queries) QueryGreeter(ctx context.Context) ([]string, error) {
	rows, err := q.db.Query(ctx, queryGreeter)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []string
	for rows.Next() {
		var hello string
		if err := rows.Scan(&hello); err != nil {
			return nil, err
		}
		items = append(items, hello)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const queryHistoricalInclusionTimes = `-- name: QueryHistoricalInclusionTimes :many
WITH daily_inclusion_times AS (
    SELECT
        EXTRACT(EPOCH FROM DATE(tse.created_at)) AS submission_date_unix,
        FLOOR(EXTRACT(EPOCH FROM (dtx.created_at - tse.created_at))) AS inclusion_time_seconds
    FROM
        transaction_submitted_event tse
    JOIN
        decrypted_tx dtx
    ON
        tse.id = dtx.transaction_submitted_event_id
    WHERE
        dtx.tx_status = 'included'
        AND tse.created_at >= NOW() - INTERVAL '30 days'
)
SELECT
    submission_date_unix::BIGINT,
    COUNT(*) AS total_transactions,
    AVG(inclusion_time_seconds)::BIGINT AS avg_inclusion_time_seconds,
    MIN(inclusion_time_seconds)::BIGINT AS min_inclusion_time_seconds,
    MAX(inclusion_time_seconds)::BIGINT AS max_inclusion_time_seconds
FROM
    daily_inclusion_times
GROUP BY
    submission_date_unix
ORDER BY
    submission_date_unix DESC
`

type QueryHistoricalInclusionTimesRow struct {
	SubmissionDateUnix      int64
	TotalTransactions       int64
	AvgInclusionTimeSeconds int64
	MinInclusionTimeSeconds int64
	MaxInclusionTimeSeconds int64
}

func (q *Queries) QueryHistoricalInclusionTimes(ctx context.Context) ([]QueryHistoricalInclusionTimesRow, error) {
	rows, err := q.db.Query(ctx, queryHistoricalInclusionTimes)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []QueryHistoricalInclusionTimesRow
	for rows.Next() {
		var i QueryHistoricalInclusionTimesRow
		if err := rows.Scan(
			&i.SubmissionDateUnix,
			&i.TotalTransactions,
			&i.AvgInclusionTimeSeconds,
			&i.MinInclusionTimeSeconds,
			&i.MaxInclusionTimeSeconds,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const queryIncludedTxsInSlot = `-- name: QueryIncludedTxsInSlot :many
SELECT tx_hash, EXTRACT(EPOCH FROM created_at)::BIGINT AS included_timestamp  
FROM decrypted_tx 
WHERE slot = $1 AND tx_status = 'included'
`

type QueryIncludedTxsInSlotRow struct {
	TxHash            []byte
	IncludedTimestamp int64
}

func (q *Queries) QueryIncludedTxsInSlot(ctx context.Context, slot int64) ([]QueryIncludedTxsInSlotRow, error) {
	rows, err := q.db.Query(ctx, queryIncludedTxsInSlot, slot)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []QueryIncludedTxsInSlotRow
	for rows.Next() {
		var i QueryIncludedTxsInSlotRow
		if err := rows.Scan(&i.TxHash, &i.IncludedTimestamp); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const queryLatestIncludedTXs = `-- name: QueryLatestIncludedTXs :many
SELECT '0x' || Encode(dt.tx_hash, 'hex') tx_hash, '0x' || Encode(tse.event_tx_hash, 'hex') event_tx_hash, FLOOR(EXTRACT(EPOCH FROM dt.created_at)) AS included_at_unix
FROM decrypted_tx dt
INNER JOIN transaction_submitted_event tse ON dt.transaction_submitted_event_id = tse.id
WHERE dt.tx_status = 'included'
ORDER BY dt.created_at DESC
LIMIT $1
`

type QueryLatestIncludedTXsRow struct {
	TxHash         interface{}
	EventTxHash    interface{}
	IncludedAtUnix float64
}

func (q *Queries) QueryLatestIncludedTXs(ctx context.Context, limit int32) ([]QueryLatestIncludedTXsRow, error) {
	rows, err := q.db.Query(ctx, queryLatestIncludedTXs, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []QueryLatestIncludedTXsRow
	for rows.Next() {
		var i QueryLatestIncludedTXsRow
		if err := rows.Scan(&i.TxHash, &i.EventTxHash, &i.IncludedAtUnix); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const queryLatestPendingTXs = `-- name: QueryLatestPendingTXs :many
SELECT
    tse.id,
    encode(tse.event_tx_hash, 'hex') AS sequencer_tx_hash,
    FLOOR(EXTRACT(EPOCH FROM tse.created_at)) as created_at_unix
FROM transaction_submitted_event tse
WHERE NOT EXISTS (
    SELECT 1
    FROM decrypted_tx dt
    WHERE dt.transaction_submitted_event_id = tse.id
      AND dt.tx_status IS NOT NULL
)
ORDER BY tse.created_at DESC
LIMIT $1
`

type QueryLatestPendingTXsRow struct {
	ID              int64
	SequencerTxHash string
	CreatedAtUnix   float64
}

func (q *Queries) QueryLatestPendingTXs(ctx context.Context, limit int32) ([]QueryLatestPendingTXsRow, error) {
	rows, err := q.db.Query(ctx, queryLatestPendingTXs, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []QueryLatestPendingTXsRow
	for rows.Next() {
		var i QueryLatestPendingTXsRow
		if err := rows.Scan(&i.ID, &i.SequencerTxHash, &i.CreatedAtUnix); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const queryLatestPendingTXsWhichCanBeDecrypted = `-- name: QueryLatestPendingTXsWhichCanBeDecrypted :many
WITH latest_per_hash AS (
  SELECT 
    tx_hash,
    MAX(created_at) AS latest_created_at
  FROM decrypted_tx d0
  WHERE 
    tx_status = 'not included'
    AND NOT EXISTS(
      SELECT 1 FROM decrypted_tx d1 WHERE d1.tx_hash = d0.tx_hash AND tx_status = 'included'
    )
  GROUP BY tx_hash
),
latest_transactions AS (
  SELECT 
    tx_hash,
    latest_created_at
  FROM latest_per_hash
  ORDER BY latest_created_at DESC
  LIMIT $1
)
SELECT 
  '0x' || encode(lt.tx_hash, 'hex') AS tx_hash,
  lt.latest_created_at AS created_at
FROM latest_transactions lt
`

type QueryLatestPendingTXsWhichCanBeDecryptedRow struct {
	TxHash    interface{}
	CreatedAt interface{}
}

func (q *Queries) QueryLatestPendingTXsWhichCanBeDecrypted(ctx context.Context, limit int32) ([]QueryLatestPendingTXsWhichCanBeDecryptedRow, error) {
	rows, err := q.db.Query(ctx, queryLatestPendingTXsWhichCanBeDecrypted, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []QueryLatestPendingTXsWhichCanBeDecryptedRow
	for rows.Next() {
		var i QueryLatestPendingTXsWhichCanBeDecryptedRow
		if err := rows.Scan(&i.TxHash, &i.CreatedAt); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const queryLatestSequencerTransactions = `-- name: QueryLatestSequencerTransactions :many
SELECT encode(event_tx_hash, 'hex') AS sequencer_tx_hash, sender, FLOOR(EXTRACT(EPOCH FROM created_at)) as created_at_unix
FROM transaction_submitted_event 
ORDER BY created_at DESC
LIMIT $1
`

type QueryLatestSequencerTransactionsRow struct {
	SequencerTxHash string
	Sender          []byte
	CreatedAtUnix   float64
}

func (q *Queries) QueryLatestSequencerTransactions(ctx context.Context, limit int32) ([]QueryLatestSequencerTransactionsRow, error) {
	rows, err := q.db.Query(ctx, queryLatestSequencerTransactions, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []QueryLatestSequencerTransactionsRow
	for rows.Next() {
		var i QueryLatestSequencerTransactionsRow
		if err := rows.Scan(&i.SequencerTxHash, &i.Sender, &i.CreatedAtUnix); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const querySlotAndValidatorData = `-- name: QuerySlotAndValidatorData :many
SELECT 
    pd.public_key, 
    pd.validator_index, 
    pd.slot,
    le.is_registeration
FROM 
    proposer_duties pd
LEFT JOIN (
    SELECT DISTINCT ON (vrm.validator_index)
        vrm.validator_index, 
        vrm.is_registeration,
        vrm.validity
    FROM 
        validator_registration_message vrm
    INNER JOIN 
        validator_status vs
    ON 
        vrm.validator_index = vs.validator_index
    WHERE 
        vrm.validity = 'valid'
        AND vs.status = 'active_ongoing'
    ORDER BY 
        vrm.validator_index, 
        vrm.created_at DESC
) AS le
ON 
    pd.validator_index = le.validator_index
WHERE 
    pd.slot BETWEEN $1 AND $2
ORDER BY 
    pd.slot DESC
`

type QuerySlotAndValidatorDataParams struct {
	Slot   int64
	Slot_2 int64
}

type QuerySlotAndValidatorDataRow struct {
	PublicKey       string
	ValidatorIndex  int64
	Slot            int64
	IsRegisteration pgtype.Bool
}

func (q *Queries) QuerySlotAndValidatorData(ctx context.Context, arg QuerySlotAndValidatorDataParams) ([]QuerySlotAndValidatorDataRow, error) {
	rows, err := q.db.Query(ctx, querySlotAndValidatorData, arg.Slot, arg.Slot_2)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []QuerySlotAndValidatorDataRow
	for rows.Next() {
		var i QuerySlotAndValidatorDataRow
		if err := rows.Scan(
			&i.PublicKey,
			&i.ValidatorIndex,
			&i.Slot,
			&i.IsRegisteration,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const queryTotalRegisteredValidators = `-- name: QueryTotalRegisteredValidators :one
SELECT COUNT(*)
FROM (
    SELECT DISTINCT ON (vrm.validator_index)
        vrm.validator_index, 
        vrm.is_registeration,
        vrm.validity
    FROM 
        validator_registration_message vrm
    INNER JOIN 
        validator_status vs
    ON 
        vrm.validator_index = vs.validator_index
    WHERE 
        vrm.validity = 'valid'
        AND vs.status = 'active_ongoing'
    ORDER BY 
        vrm.validator_index, 
        vrm.created_at DESC
) AS latest_events
WHERE 
    is_registeration = TRUE
`

func (q *Queries) QueryTotalRegisteredValidators(ctx context.Context) (int64, error) {
	row := q.db.QueryRow(ctx, queryTotalRegisteredValidators)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const queryTotalTXsForEachTXStatus = `-- name: QueryTotalTXsForEachTXStatus :one
SELECT COUNT(*) FROM public.decrypted_tx where tx_status = $1
`

func (q *Queries) QueryTotalTXsForEachTXStatus(ctx context.Context, txStatus TxStatusVal) (int64, error) {
	row := q.db.QueryRow(ctx, queryTotalTXsForEachTXStatus, txStatus)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const queryTotalTXsForEachTXStatusPerMonth = `-- name: QueryTotalTXsForEachTXStatusPerMonth :many
SELECT 
    TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM-DD') AS month, 
    COUNT(*) AS total_txs
FROM decrypted_tx
WHERE tx_status = $1
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month
`

type QueryTotalTXsForEachTXStatusPerMonthRow struct {
	Month    string
	TotalTxs int64
}

func (q *Queries) QueryTotalTXsForEachTXStatusPerMonth(ctx context.Context, txStatus TxStatusVal) ([]QueryTotalTXsForEachTXStatusPerMonthRow, error) {
	rows, err := q.db.Query(ctx, queryTotalTXsForEachTXStatusPerMonth, txStatus)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []QueryTotalTXsForEachTXStatusPerMonthRow
	for rows.Next() {
		var i QueryTotalTXsForEachTXStatusPerMonthRow
		if err := rows.Scan(&i.Month, &i.TotalTxs); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const queryTransactionDetailsByTxHash = `-- name: QueryTransactionDetailsByTxHash :one
SELECT 
    tse.event_tx_hash, tse.sender, FLOOR(EXTRACT(EPOCH FROM tse.created_at)) as created_at_unix,
    dt.tx_hash AS user_tx_hash, dt.tx_status, dt.slot, FLOOR(EXTRACT(EPOCH FROM dt.created_at)) AS decrypted_tx_created_at_unix
FROM transaction_submitted_event tse 
LEFT JOIN decrypted_tx dt ON tse.id = dt.transaction_submitted_event_id
WHERE tse.event_tx_hash = $1 OR dt.tx_hash = $1
ORDER BY 
    CASE 
        WHEN dt.tx_status = 'included' THEN 1
        ELSE 2
    END,
    dt.created_at DESC NULLS LAST, 
    tse.created_at DESC
LIMIT 1
`

type QueryTransactionDetailsByTxHashRow struct {
	EventTxHash              []byte
	Sender                   []byte
	CreatedAtUnix            float64
	UserTxHash               []byte
	TxStatus                 NullTxStatusVal
	Slot                     pgtype.Int8
	DecryptedTxCreatedAtUnix float64
}

func (q *Queries) QueryTransactionDetailsByTxHash(ctx context.Context, eventTxHash []byte) (QueryTransactionDetailsByTxHashRow, error) {
	row := q.db.QueryRow(ctx, queryTransactionDetailsByTxHash, eventTxHash)
	var i QueryTransactionDetailsByTxHashRow
	err := row.Scan(
		&i.EventTxHash,
		&i.Sender,
		&i.CreatedAtUnix,
		&i.UserTxHash,
		&i.TxStatus,
		&i.Slot,
		&i.DecryptedTxCreatedAtUnix,
	)
	return i, err
}

const queryTxHashFromTransactionDetails = `-- name: QueryTxHashFromTransactionDetails :many
SELECT DISTINCT ON (encrypted_tx_hash) 
    encrypted_tx_hash, 
    tx_hash
FROM  transaction_details
WHERE encrypted_tx_hash IN (SELECT UNNEST($1::text[]))
ORDER BY encrypted_tx_hash, submission_time DESC
`

type QueryTxHashFromTransactionDetailsRow struct {
	EncryptedTxHash string
	TxHash          string
}

func (q *Queries) QueryTxHashFromTransactionDetails(ctx context.Context, dollar_1 []string) ([]QueryTxHashFromTransactionDetailsRow, error) {
	rows, err := q.db.Query(ctx, queryTxHashFromTransactionDetails, dollar_1)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []QueryTxHashFromTransactionDetailsRow
	for rows.Next() {
		var i QueryTxHashFromTransactionDetailsRow
		if err := rows.Scan(&i.EncryptedTxHash, &i.TxHash); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
