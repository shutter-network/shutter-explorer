package usecase

import "github.com/jackc/pgx/v5/pgxpool"

type Usecases struct {
	Greeter     *GreeterUsecase
	Transaction *TransactionUsecase
	// Add more usecases as needed
}

func NewUsecases(
	observerDB *pgxpool.Pool,
	erpcDB *pgxpool.Pool,
) *Usecases {
	return &Usecases{
		Greeter:     NewGreeterUsecase(observerDB),
		Transaction: NewTransactionUsecase(observerDB, erpcDB),
	}
}
