
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

-- name: QueryTotalTXsForEachTXStatusPerMonth :many
SELECT 
    TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM-DD') AS month, 
    COUNT(*) AS total_txs
FROM decrypted_tx
WHERE tx_status = $1
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

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

-- name: QueryLatestTXsWhichArePending :many
SELECT
    tse.id,
    encode(tse.event_tx_hash, 'hex') AS sequencer_tx_hash,
    tse.created_at
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

-- name: QueryIncludedTransactions :many
SELECT '0x' || Encode(tx_hash, 'hex') tx_hash, FLOOR(EXTRACT(EPOCH FROM created_at)) AS included_at_unix
FROM decrypted_tx
WHERE tx_status = 'included'
ORDER BY created_at DESC
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
WHERE slot = $1 AND tx_status = 'included';

-- name: QueryFromTransactionDetail :one
SELECT tx_hash as user_tx_hash, encrypted_tx_hash
FROM transaction_details 
WHERE tx_hash = $1 OR encrypted_tx_hash = $1
ORDER BY submission_time DESC
LIMIT 1;

-- name: QueryDecryptedTXFromSubmittedEvent :one
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
LIMIT 1;