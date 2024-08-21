-- schema-version: shutter_explorer-1 --
-- Please change the version above if you make incompatible changes to
-- the schema. We'll use this to check we're using the right schema.

CREATE TABLE greeter(
    hello varchar NOT NULL
);

CREATE TABLE decryption_keys_message (
    slot            BIGINT PRIMARY KEY,
    instance_id     BIGINT NOT NULL,
    eon             BIGINT NOT NULL,
    tx_pointer      BIGINT NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()  NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()  NOT NULL
);

CREATE TABLE decryption_key (
    id                          BIGINT PRIMARY KEY,
    eon                         BIGINT,
    identity_preimage           BYTEA,
    key                         BYTEA NOT NULL,
    created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()  NOT NULL,
    updated_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()  NOT NULL,
    UNIQUE (eon, identity_preimage)
);

CREATE TABLE decryption_keys_message_decryption_key (
    decryption_keys_message_slot            BIGINT,
    key_index                               BIGINT,
    decryption_key_id                       BIGINT NOT NULL,
    created_at                              TIMESTAMP WITH TIME ZONE DEFAULT NOW()  NOT NULL,
    updated_at                              TIMESTAMP WITH TIME ZONE DEFAULT NOW()  NOT NULL,
    PRIMARY KEY (decryption_keys_message_slot, decryption_key_id, key_index),
    FOREIGN KEY (decryption_keys_message_slot) REFERENCES decryption_keys_message (slot),
    FOREIGN KEY (decryption_key_id) REFERENCES decryption_key (id)
);

CREATE TABLE transaction_submitted_event (
    id                                  BIGINT PRIMARY KEY,
    event_block_hash                    BYTEA,
    event_block_number                  BIGINT,
    event_tx_index                      BIGINT,
    event_log_index                     BIGINT,
    eon                                 BIGINT NOT NULL,
    tx_index                            BIGINT NOT NULL,
    identity_prefix                     BYTEA  NOT NULL,
    sender                              BYTEA  NOT NULL,
    encrypted_transaction               BYTEA  NOT NULL,
    created_at                          TIMESTAMP WITH TIME ZONE DEFAULT NOW()  NOT NULL,
    updated_at                          TIMESTAMP WITH TIME ZONE DEFAULT NOW()  NOT NULL,
    UNIQUE (event_block_hash, event_block_number, event_tx_index, event_log_index)
);

CREATE TABLE IF NOT EXISTS decryption_key_share
(
    eon                         BIGINT                                  NOT NULL,
    identity_preimage           BYTEA                                   NOT NULL,
    keyper_index                BIGINT                                  NOT NULL,
    decryption_key_share        BYTEA                                   NOT NULL,
    slot                        BIGINT                                  NOT NULL,
    created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()  NOT NULL,
    updated_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()  NOT NULL,
    PRIMARY KEY (eon, identity_preimage, keyper_index)
);

CREATE TABLE IF NOT EXISTS block
(
    block_hash          BYTEA PRIMARY KEY,
    block_number        BIGINT UNIQUE NOT NULL,
    block_timestamp     BIGINT UNIQUE NOT NULL,
    tx_hash             BYTEA UNIQUE NOT NULL,
    slot                BIGINT NOT NULL,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()  NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()  NOT NULL
);


CREATE TABLE IF NOT EXISTS decrypted_tx
(
    slot                                BIGINT,
    tx_index                            BIGINT,
    tx_hash                             BYTEA NOT NULL,
    tx_status                           tx_status_val NOT NULL,
    decryption_key_id                   BIGINT,
    transaction_submitted_event_id      BIGINT,
    created_at                          TIMESTAMP WITH TIME ZONE DEFAULT NOW()  NOT NULL,
    updated_at                          TIMESTAMP WITH TIME ZONE DEFAULT NOW()  NOT NULL,
    PRIMARY KEY (slot, tx_index)
);

CREATE TABLE IF NOT EXISTS transaction_details
(
    address                 TEXT,
    nonce                   BIGINT,
    tx_hash                 TEXT,
    encrypted_tx_hash       TEXT,
    submission_time         BIGINT,
    inclusion_time          BIGINT,
    retries                 BIGINT,
    is_cancelled            BOOLEAN,
    PRIMARY KEY (address, nonce, tx_hash, encrypted_tx_hash)
)
