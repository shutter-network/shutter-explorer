package router

import (
	"github.com/gin-gonic/gin"
	"github.com/shutter-network/shutter-explorer/backend/internal/middleware"
	"github.com/shutter-network/shutter-explorer/backend/internal/usecase"
)

func NewRouter(usecases *usecase.Usecases) *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.Use(middleware.ErrorHandler())
	api := router.Group("/api")
	{
		hello := api.Group("/hello")
		hello.GET("", usecases.Greeter.QueryGreeter)
	}
	{
		transaction := api.Group("/transaction")
		transaction.GET("/get-decrypted-tx", usecases.Transaction.QueryDecryptedTX)
		transaction.GET("/pending-txs", usecases.Transaction.QueryPendingShutterizedTX)
		transaction.GET("/included-txs", usecases.Transaction.QueryIncludedTransactions)
		transaction.GET("/total-successful-txs", usecases.Transaction.QueryTotalExecutedTXsForEachTXStatus)
		transaction.GET("/total-txs-month", usecases.Transaction.QueryTotalExecutedTXsForEachTXStatusPerMonth)
	}

	return router
}
