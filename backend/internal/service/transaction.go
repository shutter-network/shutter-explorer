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

func (svc *TransactionService) QueryLatestPendingTransactions(ctx *gin.Context) {
	limit, ok := ctx.GetQuery("limit")
	if !ok {
		err := error.NewHttpError(
			"query parameter not found",
			"limit query parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}
	erpcTXs, err := svc.TransactionUsecase.QueryLatestPendingTransactions(ctx, limit)
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": erpcTXs,
	})
}

func (svc *TransactionService) QueryTotalExecutedTXsForEachTXStatus(ctx *gin.Context) {
	totalTxs, err := svc.TransactionUsecase.QueryTotalExecutedTXsForEachTXStatus(ctx, "shielded inclusion")
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": totalTxs,
	})
}

func (svc *TransactionService) QueryTotalExecutedTXsForEachTXStatusPerMonth(ctx *gin.Context) {
	totalTxsPerMonth, err := svc.TransactionUsecase.QueryTotalExecutedTXsForEachTXStatusPerMonth(ctx, "shielded inclusion")
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": totalTxsPerMonth,
	})
}

func (svc *TransactionService) QueryLatestIncludedTransactions(ctx *gin.Context) {
	limit, ok := ctx.GetQuery("limit")
	if !ok {
		err := error.NewHttpError(
			"query parameter not found",
			"limit query parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}

	txs, err := svc.TransactionUsecase.QueryLatestIncludedTransactions(ctx, limit)
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": txs,
	})
}

func (svc *TransactionService) QueryTransactionDetailsByTxHash(ctx *gin.Context) {
	txHash := ctx.Param("hash")
	if len(txHash) == 0 {
		err := error.NewHttpError(
			"query parameter not found",
			"hash parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}
	txDetail, err := svc.TransactionUsecase.QueryTransactionDetailsByTxHash(ctx, txHash)
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": txDetail,
	})
}

func (svc *TransactionService) QueryLatestSequencerTransactions(ctx *gin.Context) {
	limit, ok := ctx.GetQuery("limit")
	if !ok {
		err := error.NewHttpError(
			"query parameter not found",
			"limit query parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}

	txs, err := svc.TransactionUsecase.QueryLatestSequencerTransactions(ctx, limit)
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": txs,
	})
}

func (svc *TransactionService) QueryTransactionPercentage(ctx *gin.Context) {
	transactionPercentage, err := svc.TransactionUsecase.QueryTransactionPercentage(ctx, "shielded inclusion")
	if err != nil {
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": transactionPercentage,
	})
}
