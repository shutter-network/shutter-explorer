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

	api := router.Group("/api")
	{
		transaction := api.Group("/transaction")
		transaction.GET("/get-decrypted-tx", transactionService.QueryDecryptedTX)
		transaction.GET("/pending-txs", transactionService.QueryPendingShutterizedTX)
		transaction.GET("/included-txs", transactionService.QueryIncludedTransactions)
		transaction.GET("/total-successful-txs", transactionService.QueryTotalExecutedTXsForEachTXStatus)
		transaction.GET("/total-txs-month", transactionService.QueryTotalExecutedTXsForEachTXStatusPerMonth)
	}
	{
		validator := api.Group("/validator")
		validator.GET("/total-registered-validators", validatorService.QueryTotalRegisteredValidators)
	}
	{
		slot := api.Group("slot")
		slot.GET("/top-5-epochs", slotService.QueryTop5Epochs)
	}

	return router
}
