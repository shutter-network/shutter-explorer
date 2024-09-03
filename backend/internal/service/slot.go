package service

import (
	"net/http"

	"github.com/gin-gonic/gin"
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
