package usecase

import (
	"context"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog/log"
	observerUtils "github.com/shutter-network/gnosh-metrics/common/utils"
	"github.com/shutter-network/shutter-explorer/backend/internal/data"
	"github.com/shutter-network/shutter-explorer/backend/internal/error"
)

type SlotUsecase struct {
	observerDB      *pgxpool.Pool
	observerDBQuery *data.Queries
}

func NewSlotUsecase(
	observerDB *pgxpool.Pool,
) *SlotUsecase {
	return &SlotUsecase{
		observerDB:      observerDB,
		observerDBQuery: data.New(observerDB),
	}
}

func (uc *SlotUsecase) QueryTop5Epochs(ctx context.Context) ([]data.QuerySlotAndValidatorDataByEpochRow, *error.Http) {
	currentTimestamp := time.Now().Unix()
	genesisTimestamp, err := strconv.Atoi(os.Getenv("GENESIS_TIMESTAMP"))
	if err != nil {
		err := error.NewHttpError(
			"error encountered while converting",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}
	slotDuration, err := strconv.Atoi(os.Getenv("SLOT_DURATION"))
	if err != nil {
		err := error.NewHttpError(
			"error encountered while converting",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}
	slotsPerEpoch, err := strconv.Atoi(os.Getenv("SLOTS_PER_EXPOCH"))
	if err != nil {
		err := error.NewHttpError(
			"error encountered while converting",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}
	currentSlot := observerUtils.GetSlotNumber(uint64(currentTimestamp), uint64(genesisTimestamp), uint64(slotDuration))
	currentEpoch := observerUtils.GetEpochNumber(currentSlot, uint64(slotsPerEpoch))
	nextEpoch := currentEpoch + 1

	epochs := make([]int64, 5)
	for i := nextEpoch; i > nextEpoch-5; i-- {
		epochs[nextEpoch-i] = int64(i)
	}
	slotAndValidatorData, err := uc.observerDBQuery.QuerySlotAndValidatorDataByEpoch(ctx, epochs)
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}
	return slotAndValidatorData, nil
}
