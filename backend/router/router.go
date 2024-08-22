package router

import (
	"github.com/gin-gonic/gin"
	"github.com/shutter-network/shutter-explorer/backend/internal/middleware"
	"github.com/shutter-network/shutter-explorer/backend/internal/service"
	"github.com/shutter-network/shutter-explorer/backend/internal/usecase"
)

func NewRouter(usecases *usecase.Usecases) *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.Use(middleware.ErrorHandler())
	transactionService := service.NewTransactionService(usecases.TransactionUsecase)
	api := router.Group("/api")
	{
		transaction := api.Group("/transaction")
		transaction.GET("/get-decrypted-tx", transactionService.QueryDecryptedTX)
		transaction.GET("/pending-txs", transactionService.QueryPendingShutterizedTX)
		transaction.GET("/included-txs", transactionService.QueryIncludedTransactions)
		transaction.GET("/total-successful-txs", transactionService.QueryTotalExecutedTXsForEachTXStatus)
		transaction.GET("/total-txs-month", transactionService.QueryTotalExecutedTXsForEachTXStatusPerMonth)
	}

	return router
}
