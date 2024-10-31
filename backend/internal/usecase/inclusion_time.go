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
	Shielded     int64
	Unshielded   int64
	NotIncluded  int64
	Pending      int64
	Invalid      int64
	NotDecrypted int64
	Total        int64
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
		resp.Total += stats[i].Count
		switch stats[i].TxStatus {
		case data.TxStatusValInvalid:
			resp.Invalid = stats[i].Count
		case data.TxStatusValNotdecrypted:
			resp.NotDecrypted = stats[i].Count
		case data.TxStatusValNotincluded:
			resp.NotIncluded = stats[i].Count
		case data.TxStatusValPending:
			resp.Pending = stats[i].Count
		case data.TxStatusValShieldedinclusion:
			resp.Shielded = stats[i].Count
		case data.TxStatusValUnshieldedinclusion:
			resp.Unshielded = stats[i].Count
		}
	}

	return resp, nil
}

func (uc *InclusionTimeUsecase) QueryHistoricalInclusionTimes(ctx context.Context) ([]data.QueryHistoricalInclusionTimesRow, *error.Http) {
	historicalInclusionTimes, err := uc.observerDBQuery.QueryHistoricalInclusionTimes(ctx)
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}
	return historicalInclusionTimes, nil
}
