
-- name: QueryGreeter :many
SELECT * from greeter;

-- name: QueryDecryptionKeyShare :many
SELECT * FROM decryption_key_share
WHERE eon = $1 AND identity_preimage = $2 AND keyper_index = $3;

-- name: QueryBlockFromSlot :one
SELECT * FROM block WHERE slot = $1;

-- name: QueryDecryptionKeysAndMessage :many
SELECT
    dkm.slot, dkm.tx_pointer, dkm.eon, 
    dk.key, dk.identity_preimage, dkmdk.key_index
FROM decryption_keys_message_decryption_key dkmdk
LEFT JOIN decryption_keys_message dkm ON dkmdk.decryption_keys_message_slot = dkm.slot
LEFT JOIN decryption_key dk ON dkmdk.decryption_key_eon = dk.eon AND dkmdk.decryption_key_identity_preimage = dk.identity_preimage
WHERE dkm.slot = $1 ORDER BY dkmdk.key_index ASC;

-- name: QueryTransactionSubmittedEvent :many
SELECT * FROM transaction_submitted_event
WHERE eon = $1 AND tx_index >= $2 AND tx_index < $2 + $3 ORDER BY tx_index ASC;