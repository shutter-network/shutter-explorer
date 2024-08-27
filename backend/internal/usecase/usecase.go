package usecase

import "github.com/jackc/pgx/v5/pgxpool"

type Usecases struct {
	TransactionUsecase *TransactionUsecase
	// Add more usecases as needed
}

func NewUsecases(
	observerDB *pgxpool.Pool,
	erpcDB *pgxpool.Pool,
) *Usecases {
	return &Usecases{
		TransactionUsecase: NewTransactionUsecase(observerDB, erpcDB),
	}
}
