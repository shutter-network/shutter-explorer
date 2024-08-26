package usecase

import (
	"context"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog/log"
	"github.com/shutter-network/shutter-explorer/backend/internal/data"
	"github.com/shutter-network/shutter-explorer/backend/internal/error"
)

type ValidatorUsecase struct {
	observerDB      *pgxpool.Pool
	observerDBQuery *data.Queries
}

func NewValidatorUsecase(
	observerDB *pgxpool.Pool,
) *ValidatorUsecase {
	return &ValidatorUsecase{
		observerDB:      observerDB,
		observerDBQuery: data.New(observerDB),
	}
}

func (uc *ValidatorUsecase) QueryTotalRegisteredValidators(ctx context.Context) (int64, *error.Http) {
	totalValidators, err := uc.observerDBQuery.QueryTotalRegisteredValidators(ctx)
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return 0, &err
	}
	return totalValidators, nil
}
