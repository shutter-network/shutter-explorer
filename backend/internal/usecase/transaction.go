package usecase

import (
	"encoding/hex"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shutter-network/shutter-explorer/backend/internal/data"
	"github.com/shutter-network/shutter-explorer/backend/internal/error"
)

type TransactionUsecase struct {
	observerDB      *pgxpool.Pool
	erpcDB          *pgxpool.Pool
	observerDBQuery *data.Queries
	erpcDBQuery     *data.Queries
}

func NewTransactionUsecase(
	observerDB *pgxpool.Pool,
	erpcDB *pgxpool.Pool,
) *TransactionUsecase {
	return &TransactionUsecase{
		observerDB:      observerDB,
		observerDBQuery: data.New(observerDB),
		erpcDB:          erpcDB,
		erpcDBQuery:     data.New(erpcDB),
	}
}

func (uc *TransactionUsecase) QueryDecryptedTX(ctx *gin.Context) {
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
	ecTxBytes, err := hex.DecodeString(ecTx)
	if err != nil {
		err := error.NewHttpError(
			"unable to decode encrypted tx",
			"valid encryptedTx query parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}
	decryptedTx, err := uc.observerDBQuery.QueryDecryptedTXForEncryptedTX(ctx, ecTxBytes)
	if err != nil {
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": decryptedTx,
	})
}

func (uc *TransactionUsecase) QueryPendingShutterizedTX(ctx *gin.Context) {
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
	txLimit, err := strconv.Atoi(txLimitStringified)
	if err != nil {
		err := error.NewHttpError(
			"unable to decode txLimit",
			"valid txLimit query parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}
	pendingObserverTxs, err := uc.observerDBQuery.QueryLatestShutterizedTXsWhichArentIncluded(ctx, int32(txLimit))
	if err != nil {
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		ctx.Error(err)
		return
	}
	ecTXHashes := make([]string, len(pendingObserverTxs))

	for i := 0; i < len(pendingObserverTxs); i++ {
		ecTXHashes[i] = hex.EncodeToString(pendingObserverTxs[i].EncryptedTransaction)
	}

	erpcTXs, err := uc.erpcDBQuery.QueryTxHashFromTransactionDetails(ctx, ecTXHashes)
	if err != nil {
		err := error.NewHttpError(
			"error encountered while querying for dataz",
			"",
			http.StatusInternalServerError,
		)
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": erpcTXs,
	})
}

func (uc *TransactionUsecase) QueryTotalExecutedTXsForEachTXStatus(ctx *gin.Context) {
	txStatus, ok := ctx.GetQuery("txStatus")
	if !ok {
		err := error.NewHttpError(
			"query parameter not found",
			"encryptedTx query parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}

	totalTxs, err := uc.observerDBQuery.QueryTotalShutterizedTXsForEachTXStatus(ctx, txStatus)
	if err != nil {
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": totalTxs,
	})
}

func (uc *TransactionUsecase) QueryTotalExecutedTXsForEachTXStatusPerMonth(ctx *gin.Context) {
	txStatus, ok := ctx.GetQuery("txStatus")
	if !ok {
		err := error.NewHttpError(
			"query parameter not found",
			"encryptedTx query parameter is required",
			http.StatusBadRequest,
		)
		ctx.Error(err)
		return
	}

	totalTxsPerMonth, err := uc.observerDBQuery.QueryTotalShutterizedTXsForEachTXStatusPerMonth(ctx, txStatus)
	if err != nil {
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		ctx.Error(err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": totalTxsPerMonth,
	})
}
