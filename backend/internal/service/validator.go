package service

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shutter-network/shutter-explorer/backend/internal/usecase"
)

type ValidatorService struct {
	ValidatorUsecase *usecase.ValidatorUsecase
}

func NewValidatorService(validatorUsecase *usecase.ValidatorUsecase) *ValidatorService {
	return &ValidatorService{
		ValidatorUsecase: validatorUsecase,
	}
}

func (svc *ValidatorService) QueryTotalRegisteredValidators(ctx *gin.Context) {
	totalValidators, err := svc.ValidatorUsecase.QueryTotalRegisteredValidators(ctx)
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": totalValidators,
	})
}
