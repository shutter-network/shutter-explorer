package usecase

import (
	"context"
	"net/http"
	"os"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog/log"
	"github.com/shutter-network/shutter-explorer/backend/internal/data"
	"github.com/shutter-network/shutter-explorer/backend/internal/error"
)

type QueryExectuedTransactionStatsResp struct {
	Successful int64
	Failed     int64
}

type InclusionTimeUsecase struct {
	observerDB      *pgxpool.Pool
	observerDBQuery *data.Queries
}

func NewInclusionTimeUsecase(
	observerDB *pgxpool.Pool,
) *InclusionTimeUsecase {
	return &InclusionTimeUsecase{
		observerDB:      observerDB,
		observerDBQuery: data.New(observerDB),
	}
}

func (uc *InclusionTimeUsecase) QueryEstimatedInclusionTime(ctx context.Context) (int64, *error.Http) {
	totalRegisteredValidators, err := uc.observerDBQuery.QueryTotalRegisteredValidators(ctx)
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return 0, &err
	}

	totalGnosisValidatorsStringified := os.Getenv("TOTAL_GNOSIS_VALIDATORS")
	totalGnosisValidators, err := strconv.Atoi(totalGnosisValidatorsStringified)
	if err != nil {
		log.Err(err).Msg("err encountered while parsing total gnosis validators")
		err := error.NewHttpError(
			"error encountered while parsing",
			"",
			http.StatusInternalServerError,
		)
		return 0, &err
	}

	slotDurationStringified := os.Getenv("SLOT_DURATION")
	slotDuration, err := strconv.Atoi(slotDurationStringified)
	if err != nil {
		log.Err(err).Msg("err encountered while parsing slot duration")
		err := error.NewHttpError(
			"error encountered while parsing",
			"",
			http.StatusInternalServerError,
		)
		return 0, &err
	}
	estimatedInclusionTime := (int64(totalGnosisValidators) / totalRegisteredValidators) * int64(slotDuration)
	return estimatedInclusionTime, nil
}

func (uc *InclusionTimeUsecase) QueryExecutedTransactionStats(ctx context.Context) (*QueryExectuedTransactionStatsResp, *error.Http) {
	stats, err := uc.observerDBQuery.QueryExecutedTransactionStats(ctx)
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}

	resp := &QueryExectuedTransactionStatsResp{}
	for i := 0; i < len(stats); i++ {
		if stats[i].TxStatus == data.TxStatusValIncluded {
			resp.Successful = stats[i].Count
		} else if stats[i].TxStatus == data.TxStatusValNotincluded {
			resp.Failed = stats[i].Count
		}
	}

	return resp, nil
}
