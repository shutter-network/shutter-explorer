
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

-- name: QueryTotalShutterizedTXsForEachTXStatus :one
SELECT COUNT(*) FROM public.decrypted_tx where tx_status = $1;

-- name: QueryTotalShutterizedTXsForEachTXStatusPerMonth :many
SELECT 
    DATE_TRUNC('month', created_at) AS month, 
    COUNT(*) AS total_included_txs
FROM decrypted_tx
WHERE tx_status = $1
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- name: QueryLatestPendingShutterizedTXs :many
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

-- name: QueryLatestShutterizedTXsForEachTXStatus :many
SELECT 
    dt.tx_hash, dt.tx_status,
    tse.encrypted_transaction,
    dk.key
FROM decrypted_tx dt 
INNER JOIN transaction_submitted_event tse ON dt.transaction_submitted_event_id = tse.id
INNER JOIN decryption_key dk ON dt.decryption_key_id = dk.id
WHERE dt.tx_status = $1
ORDER BY dt.created_at DESC
LIMIT $2;