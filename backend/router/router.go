package router

import (
	"context"

	"github.com/gin-gonic/gin"
	"github.com/shutter-network/shutter-explorer/backend/internal/middleware"
	"github.com/shutter-network/shutter-explorer/backend/internal/service"
	"github.com/shutter-network/shutter-explorer/backend/internal/usecase"
	"github.com/shutter-network/shutter-explorer/backend/internal/websocket"
)

func NewRouter(ctx context.Context, usecases *usecase.Usecases) *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.Use(middleware.ErrorHandler())
	manager := websocket.NewClientManager(usecases)
	// Start the WebSocket manager
	go manager.Run(ctx)

	router.GET("/ws", manager.HandleWebSocket)
	transactionService := service.NewTransactionService(usecases.TransactionUsecase)
	validatorService := service.NewValidatorService(usecases.ValidatorUsecase)
	slotService := service.NewSlotService(usecases.SlotUsecase)
	inclusionTimeService := service.NewInclusionTimeService(usecases.InclusionTimeUsecase)

	api := router.Group("/api")
	{
		transaction := api.Group("/transaction")
		transaction.GET("/get_decrypted_transactions", transactionService.QueryDecryptedTX)
		transaction.GET("/latest_pending_transactions", transactionService.QueryLatestPendingTransactions)
		transaction.GET("/latest_user_transactions", transactionService.QueryLatestIncludedTransactions)
		transaction.GET("/total_executed_transactions", transactionService.QueryTotalExecutedTXsForEachTXStatus)
		transaction.GET("/total_transactions_per_month", transactionService.QueryTotalExecutedTXsForEachTXStatusPerMonth)
		transaction.GET("/:hash", transactionService.QueryTransactionDetailsByTxHash)
		transaction.GET("/latest_sequencer_transactions", transactionService.QueryLatestSequencerTransactions)
		transaction.GET("/transaction_percentage", transactionService.QueryTransactionPercentage)
	}
	{
		validator := api.Group("/validator")
		validator.GET("/total_registered_validators", validatorService.QueryTotalRegisteredValidators)
		validator.GET("/total_gnosis_validators", validatorService.QueryTotalGnosisValidators)
	}
	{
		slot := api.Group("slot")
		slot.GET("/top_5_epochs", slotService.QueryTop5Epochs)
		slot.GET("/included_transactions", slotService.QueryIncludedTXsInSlot)
	}
	{
		inclusionTime := api.Group("inclusion_time")
		inclusionTime.GET("/estimated_inclusion_time", inclusionTimeService.QueryEstimatedInclusionTime)
		inclusionTime.GET("/executed_transactions", inclusionTimeService.QueryExecutedTransactionStats)
		inclusionTime.GET("/historical_inclusion_time", inclusionTimeService.QueryHistoricalInclusionTimes)
	}
	return router
}
