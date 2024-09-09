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

func (uc *SlotUsecase) QueryTop5Epochs(ctx context.Context) ([]data.QuerySlotAndValidatorDataRow, *error.Http) {
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

	lowestEpoch := nextEpoch - 4
	firstSlotOfLowestEpoch := observerUtils.GetFirstSlotOfEpoch(lowestEpoch, uint64(slotsPerEpoch))
	lastSlotOfNextEpoch := observerUtils.GetLastSlotOfEpoch(nextEpoch, uint64(slotsPerEpoch))

	slotAndValidatorData, err := uc.observerDBQuery.QuerySlotAndValidatorData(ctx, data.QuerySlotAndValidatorDataParams{
		Slot:   int64(firstSlotOfLowestEpoch),
		Slot_2: int64(lastSlotOfNextEpoch),
	})
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

func (uc *SlotUsecase) QueryIncludedTXsInSlot(ctx context.Context, slot int64) ([]data.QueryIncludedTxsInSlotRow, *error.Http) {
	includedTxs, err := uc.observerDBQuery.QueryIncludedTxsInSlot(ctx, slot)
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}
	return includedTxs, nil
}
