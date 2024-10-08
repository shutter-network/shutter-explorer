
-- name: QueryGreeter :many
SELECT * from greeter;

-- name: QueryDecryptedTXForEncryptedTX :many
SELECT 
    dt.tx_hash, dt.tx_status,
    tse.encrypted_transaction,
    dk.key
FROM decrypted_tx dt 
INNER JOIN transaction_submitted_event tse ON dt.transaction_submitted_event_id = tse.id
INNER JOIN decryption_key dk ON dt.decryption_key_id = dk.id
WHERE tse.encrypted_transaction = $1;

-- name: QueryTotalTXsForEachTXStatus :one
SELECT COUNT(*) FROM public.decrypted_tx where tx_status = $1;

-- name: QueryTotalTXsForEachTXStatusLast30Days :one
SELECT COUNT(*) AS transaction_count
FROM decrypted_tx
WHERE tx_status = $1
  AND created_at >= NOW() - INTERVAL '30 days';

-- name: QueryLatestPendingTXsWhichCanBeDecrypted :many
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
FROM latest_transactions lt;

-- name: QueryLatestPendingTXs :many
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
LIMIT $1;

-- name: QueryTxHashFromTransactionDetails :many
SELECT DISTINCT ON (encrypted_tx_hash) 
    encrypted_tx_hash, 
    tx_hash
FROM  transaction_details
WHERE encrypted_tx_hash IN (SELECT UNNEST($1::text[]))
ORDER BY encrypted_tx_hash, submission_time DESC;

-- name: QueryLatestIncludedTXs :many
SELECT '0x' || Encode(dt.tx_hash, 'hex') tx_hash, '0x' || Encode(tse.event_tx_hash, 'hex') event_tx_hash, FLOOR(EXTRACT(EPOCH FROM dt.created_at)) AS included_at_unix
FROM decrypted_tx dt
INNER JOIN transaction_submitted_event tse ON dt.transaction_submitted_event_id = tse.id
WHERE dt.tx_status = 'shielded inclusion'
ORDER BY dt.created_at DESC
LIMIT $1;

-- name: QueryTotalRegisteredValidators :one
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
    is_registeration = TRUE;

-- name: QuerySlotAndValidatorData :many
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
    pd.slot DESC;

-- name: QueryIncludedTxsInSlot :many
SELECT tx_hash, EXTRACT(EPOCH FROM created_at)::BIGINT AS included_timestamp  
FROM decrypted_tx 
WHERE slot = $1 AND tx_status = 'shielded inclusion';

-- name: QueryFromTransactionDetails :one
SELECT tx_hash as user_tx_hash, encrypted_tx_hash
FROM transaction_details 
WHERE tx_hash = $1 OR encrypted_tx_hash = $1
ORDER BY submission_time DESC
LIMIT 1;

-- name: QueryTransactionDetailsByTxHash :one
SELECT 
    tse.event_tx_hash, tse.sender, FLOOR(EXTRACT(EPOCH FROM tse.created_at)) as created_at_unix, tse.created_at,
    dt.tx_hash AS user_tx_hash, dt.tx_status, dt.slot, 
    COALESCE(FLOOR(EXTRACT(EPOCH FROM dt.created_at)), 0)::BIGINT AS decrypted_tx_created_at_unix
FROM transaction_submitted_event tse 
LEFT JOIN decrypted_tx dt ON tse.id = dt.transaction_submitted_event_id
WHERE tse.event_tx_hash = $1 OR dt.tx_hash = $1
LIMIT 1;

-- name: QueryLatestSequencerTransactions :many
SELECT ('0x' || encode(event_tx_hash, 'hex'))::TEXT AS sequencer_tx_hash, FLOOR(EXTRACT(EPOCH FROM created_at)) as created_at_unix
FROM transaction_submitted_event 
ORDER BY created_at DESC
LIMIT $1;

-- name: QueryExecutedTransactionStats :many
SELECT COUNT(id), tx_status FROM decrypted_tx
GROUP BY tx_status;

-- name: QueryHistoricalInclusionTimes :many
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
        dtx.tx_status = 'shielded inclusion'
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
    submission_date_unix DESC;
