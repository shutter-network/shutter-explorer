
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

-- name: QueryLatestTXsWhichArentIncluded :many
WITH latest_events AS (
    SELECT 
        id,
        encrypted_transaction,
        created_at
    FROM (
        SELECT DISTINCT ON (encrypted_transaction)
            id,
            encrypted_transaction,
            created_at
        FROM 
            transaction_submitted_event
        ORDER BY 
            encrypted_transaction, 
            created_at DESC
    ) subquery
    ORDER BY 
        created_at DESC
    LIMIT $1
)
SELECT
    le.id,
    le.encrypted_transaction,
	  dt.tx_status,
    le.created_at
FROM latest_events le
LEFT JOIN decrypted_tx dt ON le.id = dt.transaction_submitted_event_id
WHERE dt.tx_status = 'not included' OR dt.tx_status IS NULL
ORDER BY le.created_at DESC;

-- name: QueryTxHashFromTransactionDetails :many
SELECT DISTINCT ON (encrypted_tx_hash) 
    encrypted_tx_hash, 
    tx_hash
FROM  transaction_details
WHERE encrypted_tx_hash IN (SELECT UNNEST($1::text[]))
ORDER BY encrypted_tx_hash, submission_time DESC;

-- name: QueryIncludedTransactions :many
SELECT dt.tx_hash, tse.encrypted_transaction, dt.created_at
FROM decrypted_tx dt
INNER JOIN transaction_submitted_event tse ON dt.transaction_submitted_event_id = tse.id
WHERE dt.tx_status = 'included'
ORDER BY dt.created_at
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