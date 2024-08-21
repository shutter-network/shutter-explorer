
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
    SELECT DISTINCT ON (encrypted_transaction)
        id,
        encrypted_transaction,
        created_at
    FROM transaction_submitted_event
    ORDER BY encrypted_transaction, created_at DESC
	  LIMIT $1
),
decryption_status AS (
    SELECT
        encrypted_transaction,
        MAX(tx_status) AS max_status
    FROM decrypted_tx
    JOIN latest_events le ON decrypted_tx.transaction_submitted_event_id = le.id
    GROUP BY encrypted_transaction
)
SELECT
    le.encrypted_transaction,
    le.created_at
FROM latest_events le
LEFT JOIN decryption_status ds ON le.encrypted_transaction = ds.encrypted_transaction
WHERE ds.max_status IS DISTINCT FROM 'included' OR ds.max_status IS NULL
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