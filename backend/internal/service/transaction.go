package service

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shutter-network/shutter-explorer/backend/internal/error"
	"github.com/shutter-network/shutter-explorer/backend/internal/usecase"
)

type TransactionService struct {
	TransactionUsecase *usecase.TransactionUsecase
}

func NewTransactionService(transactionUsecase *usecase.TransactionUsecase) *TransactionService {
	return &TransactionService{
		TransactionUsecase: transactionUsecase,
	}
}

func (svc *TransactionService) QueryDecryptedTX(ctx *gin.Context) {
	ecTx, ok := ctx.GetQuery("encryptedTx")
	if !ok {
		err := error.NewHttpError(
			"query parameter not found",
			"encryptedTx query parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}
	decryptedTx, err := svc.TransactionUsecase.QueryDecryptedTX(ctx, ecTx)
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": decryptedTx,
	})
}

func (svc *TransactionService) QueryPendingShutterizedTX(ctx *gin.Context) {
	txLimit, ok := ctx.GetQuery("txLimit")
	if !ok {
		err := error.NewHttpError(
			"query parameter not found",
			"txLimit query parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}
	erpcTXs, err := svc.TransactionUsecase.QueryPendingShutterizedTX(ctx, txLimit)
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": erpcTXs,
	})
}

func (svc *TransactionService) QueryTotalExecutedTXsForEachTXStatus(ctx *gin.Context) {
	txStatus, ok := ctx.GetQuery("txStatus")
	if !ok {
		err := error.NewHttpError(
			"query parameter not found",
			"txStatus query parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}

	totalTxs, err := svc.TransactionUsecase.QueryTotalExecutedTXsForEachTXStatus(ctx, txStatus)
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": totalTxs,
	})
}

func (svc *TransactionService) QueryTotalExecutedTXsForEachTXStatusPerMonth(ctx *gin.Context) {
	txStatus, ok := ctx.GetQuery("txStatus")
	if !ok {
		err := error.NewHttpError(
			"query parameter not found",
			"txStatus query parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}

	totalTxsPerMonth, err := svc.TransactionUsecase.QueryTotalExecutedTXsForEachTXStatusPerMonth(ctx, txStatus)
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": totalTxsPerMonth,
	})
}

func (svc *TransactionService) QueryIncludedTransactions(ctx *gin.Context) {
	txLimitStringified, ok := ctx.GetQuery("txLimit")
	if !ok {
		err := error.NewHttpError(
			"query parameter not found",
			"txLimit query parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}

	txs, err := svc.TransactionUsecase.QueryIncludedTransactions(ctx, txLimitStringified)
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": txs,
	})
}
