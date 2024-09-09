package service

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
	"github.com/shutter-network/shutter-explorer/backend/internal/error"
	"github.com/shutter-network/shutter-explorer/backend/internal/usecase"
)

type SlotService struct {
	SlotUsecase *usecase.SlotUsecase
}

func NewSlotService(slotUsecase *usecase.SlotUsecase) *SlotService {
	return &SlotService{
		SlotUsecase: slotUsecase,
	}
}

func (svc *SlotService) QueryTop5Epochs(ctx *gin.Context) {
	epochsData, err := svc.SlotUsecase.QueryTop5Epochs(ctx)
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": epochsData,
	})
}

func (svc *SlotService) QueryIncludedTXsInSlot(ctx *gin.Context) {
	slotStringified, ok := ctx.GetQuery("slot")
	if !ok {
		err := error.NewHttpError(
			"query parameter not found",
			"slot query parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}

	slot, err := strconv.Atoi(slotStringified)
	if err != nil {
		log.Err(err).Msg("err decoding slot")
		err := error.NewHttpError(
			"unable to decode slot",
			"valid slot query parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}
	includedTxs, httpErr := svc.SlotUsecase.QueryIncludedTXsInSlot(ctx, int64(slot))
	if httpErr != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": includedTxs,
	})
}
