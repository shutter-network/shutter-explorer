package usecase

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shutter-network/shutter-explorer/backend/internal/data"
)

type EncryptedTxUsecase struct {
	db      *pgxpool.Pool
	dbQuery *data.Queries
}

func NewEncryptedTxUsecase(
	db *pgxpool.Pool,
) *GreeterUsecase {
	return &GreeterUsecase{
		db:      db,
		dbQuery: data.New(db),
	}
}
