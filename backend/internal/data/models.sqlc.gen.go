// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0

package data

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type Block struct {
	BlockHash      []byte
	BlockNumber    int64
	BlockTimestamp int64
	TxHash         []byte
	Slot           int64
	CreatedAt      pgtype.Timestamptz
	UpdatedAt      pgtype.Timestamptz
}

type DecryptedTx struct {
	Slot                        int64
	TxIndex                     int64
	TxHash                      []byte
	TxStatus                    interface{}
	DecryptionKeyID             pgtype.Int8
	TransactionSubmittedEventID pgtype.Int8
	CreatedAt                   pgtype.Timestamptz
	UpdatedAt                   pgtype.Timestamptz
}

type DecryptionKey struct {
	ID               int64
	Eon              pgtype.Int8
	IdentityPreimage []byte
	Key              []byte
	CreatedAt        pgtype.Timestamptz
	UpdatedAt        pgtype.Timestamptz
}

type DecryptionKeyShare struct {
	Eon                int64
	IdentityPreimage   []byte
	KeyperIndex        int64
	DecryptionKeyShare []byte
	Slot               int64
	CreatedAt          pgtype.Timestamptz
	UpdatedAt          pgtype.Timestamptz
}

type DecryptionKeysMessage struct {
	Slot       int64
	InstanceID int64
	Eon        int64
	TxPointer  int64
	CreatedAt  pgtype.Timestamptz
	UpdatedAt  pgtype.Timestamptz
}

type DecryptionKeysMessageDecryptionKey struct {
	DecryptionKeysMessageSlot int64
	KeyIndex                  int64
	DecryptionKeyID           int64
	CreatedAt                 pgtype.Timestamptz
	UpdatedAt                 pgtype.Timestamptz
}

type Greeter struct {
	Hello string
}

type TransactionSubmittedEvent struct {
	ID                   int64
	EventBlockHash       []byte
	EventBlockNumber     pgtype.Int8
	EventTxIndex         pgtype.Int8
	EventLogIndex        pgtype.Int8
	Eon                  int64
	TxIndex              int64
	IdentityPrefix       []byte
	Sender               []byte
	EncryptedTransaction []byte
	CreatedAt            pgtype.Timestamptz
	UpdatedAt            pgtype.Timestamptz
}
