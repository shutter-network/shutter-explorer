package usecase

import "github.com/jackc/pgx/v5/pgxpool"

type Usecases struct {
	Greeter     *GreeterUsecase
	DecryptedTx *DecryptedTxUsecase
	// Add more usecases as needed
}

func NewUsecases(
	observerDB *pgxpool.Pool,
	erpcDB *pgxpool.Pool,
) *Usecases {
	return &Usecases{
		Greeter:     NewGreeterUsecase(observerDB),
		DecryptedTx: NewDecryptedTxUsecase(observerDB, erpcDB),
	}
}
