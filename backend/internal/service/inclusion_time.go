package service

import (
	"net/http"
	"strconv"

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

func (svc *InclusionTimeService) QueryExecutedTransactionStatsRecent(ctx *gin.Context) {
	daysStr := ctx.DefaultQuery("days", "30")
	days, err := strconv.Atoi(daysStr)
	if err != nil || days <= 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid days parameter"})
		return
	}
	stats, httpErr := svc.InclusionTimeUsecase.QueryExecutedTransactionStatsRecent(ctx, days)
	if httpErr != nil {
		ctx.Error(httpErr)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": stats,
	})
}

func (svc *InclusionTimeService) QueryHistoricalInclusionTimes(ctx *gin.Context) {
	historicalInclusionTimes, err := svc.InclusionTimeUsecase.QueryHistoricalInclusionTimes(ctx)
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": historicalInclusionTimes,
	})
}
