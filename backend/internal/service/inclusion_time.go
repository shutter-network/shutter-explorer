package service

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shutter-network/shutter-explorer/backend/internal/usecase"
)

type InclusionTimeService struct {
	InclusionTimeUsecase *usecase.InclusionTimeUsecase
}

func NewInclusionTimeService(inclusionTimeUsecase *usecase.InclusionTimeUsecase) *InclusionTimeService {
	return &InclusionTimeService{
		InclusionTimeUsecase: inclusionTimeUsecase,
	}
}

func (svc *InclusionTimeService) QueryEstimatedInclusionTime(ctx *gin.Context) {
	estimatedInclusionTime, err := svc.InclusionTimeUsecase.QueryEstimatedInclusionTime(ctx)
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": estimatedInclusionTime,
	})
}

func (svc *InclusionTimeService) QueryExecutedTransactionStats(ctx *gin.Context) {
	stats, err := svc.InclusionTimeUsecase.QueryExecutedTransactionStats(ctx)
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": stats,
	})
}
