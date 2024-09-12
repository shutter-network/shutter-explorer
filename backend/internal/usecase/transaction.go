package usecase

import (
	"context"
	"encoding/hex"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog/log"
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

func (uc *TransactionUsecase) QueryDecryptedTX(ctx context.Context, ecTx string) ([]data.QueryDecryptedTXForEncryptedTXRow, *error.Http) {
	ecTxBytes, err := hex.DecodeString(ecTx)
	if err != nil {
		err := error.NewHttpError(
			"unable to decode encrypted tx",
			"valid encryptedTx query parameter is required",
			http.StatusBadRequest,
		)
		return nil, &err
	}
	decryptedTx, err := uc.observerDBQuery.QueryDecryptedTXForEncryptedTX(ctx, ecTxBytes)
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}
	return decryptedTx, nil
}

func (uc *TransactionUsecase) QueryPendingShutterizedTX(ctx context.Context, limitStringified string) ([]data.QueryTxHashFromTransactionDetailsRow, *error.Http) {
	limit, err := strconv.Atoi(limitStringified)
	if err != nil {
		err := error.NewHttpError(
			"unable to decode limit",
			"valid limit query parameter is required",
			http.StatusBadRequest,
		)
		return nil, &err
	}
	pendingObserverTxs, err := uc.observerDBQuery.QueryLatestTXsWhichArentIncluded(ctx, int32(limit))
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}
	ecTXHashes := make([]string, len(pendingObserverTxs))

	for i := 0; i < len(pendingObserverTxs); i++ {
		ecTXHashes[i] = hex.EncodeToString(pendingObserverTxs[i].EncryptedTransaction)
	}

	erpcTXs, err := uc.erpcDBQuery.QueryTxHashFromTransactionDetails(ctx, ecTXHashes)
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for dataz",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}
	return erpcTXs, nil
}

func (uc *TransactionUsecase) QueryTotalExecutedTXsForEachTXStatus(ctx context.Context, txStatus string) (int64, *error.Http) {
	totalTxs, err := uc.observerDBQuery.QueryTotalTXsForEachTXStatus(ctx, txStatus)
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return 0, &err
	}
	return totalTxs, nil
}

func (uc *TransactionUsecase) QueryTotalExecutedTXsForEachTXStatusPerMonth(ctx context.Context, txStatus string) ([]data.QueryTotalTXsForEachTXStatusPerMonthRow, *error.Http) {
	totalTxsPerMonth, err := uc.observerDBQuery.QueryTotalTXsForEachTXStatusPerMonth(ctx, txStatus)
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}
	return totalTxsPerMonth, nil
}

func (uc *TransactionUsecase) QueryIncludedTransactions(ctx context.Context, limitStringified string) ([]data.QueryIncludedTransactionsRow, *error.Http) {
	limit, err := strconv.Atoi(limitStringified)
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"unable to decode limit",
			"valid limit query parameter is required",
			http.StatusBadRequest,
		)
		return nil, &err
	}

	txs, err := uc.observerDBQuery.QueryIncludedTransactions(ctx, int32(limit))
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}
	return txs, nil
}
