package usecase

import (
	"context"
	"encoding/hex"
	"net/http"
	"os"
	"strconv"

	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog/log"
	"github.com/shutter-network/shutter-explorer/backend/internal/data"
	"github.com/shutter-network/shutter-explorer/backend/internal/error"
)

type TxStatus string

const (
	Pending                TxStatus = "Pending"
	Completed              TxStatus = "Completed"
	DecryptionKeyGenerated TxStatus = "DecryptionKeyGenerated"
)

type TransactionUsecase struct {
	observerDB      *pgxpool.Pool
	erpcDB          *pgxpool.Pool
	observerDBQuery *data.Queries
	erpcDBQuery     *data.Queries
}

type QueryTransactionDetailResp struct {
	Sender                 string
	SequencerTxHash        string
	UserTxHash             string
	TxStatus               string
	InclusionSlot          int64
	SequencerTxSubmittedAt int64
	DecryptedTxCreatedAt   int64
	EffectiveInclusionTime int64
	EstimatedInclusionTime int64
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

func (uc *TransactionUsecase) QueryLatestPendingTransactions(ctx context.Context, limit string) ([]data.QueryTxHashFromTransactionDetailsRow, *error.Http) {
	txLimit, err := strconv.Atoi(limit)
	if err != nil {
		err := error.NewHttpError(
			"unable to decode limit",
			"valid limit query parameter is required",
			http.StatusBadRequest,
		)
		return nil, &err
	}
	pendingObserverTxs, err := uc.observerDBQuery.QueryLatestPendingTXs(ctx, int32(txLimit))
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}
	sqTXHashes := make([]string, len(pendingObserverTxs))

	for i := 0; i < len(pendingObserverTxs); i++ {
		sqTXHashes[i] = pendingObserverTxs[i].SequencerTxHash
	}

	erpcTXs, err := uc.erpcDBQuery.QueryTxHashFromTransactionDetails(ctx, sqTXHashes)
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
	totalTxs, err := uc.observerDBQuery.QueryTotalTXsForEachTXStatus(ctx, data.TxStatusVal(txStatus))
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
	totalTxsPerMonth, err := uc.observerDBQuery.QueryTotalTXsForEachTXStatusPerMonth(ctx, data.TxStatusVal(txStatus))
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

func (uc *TransactionUsecase) QueryLatestIncludedTransactions(ctx context.Context, limit string) ([]data.QueryLatestIncludedTXsRow, *error.Http) {
	txLimit, err := strconv.Atoi(limit)
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"unable to decode limit",
			"valid limit query parameter is required",
			http.StatusBadRequest,
		)
		return nil, &err
	}

	txs, err := uc.observerDBQuery.QueryLatestIncludedTXs(ctx, int32(txLimit))
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

func (uc *TransactionUsecase) QueryTransactionDetailsByTxHash(ctx context.Context, txHash string) (*QueryTransactionDetailResp, *error.Http) {
	txHashBytes := common.HexToHash(txHash).Bytes()

	erpcTX, erpcTxErr := uc.erpcDBQuery.QueryFromTransactionDetails(ctx, txHash)
	if erpcTxErr != nil {
		if erpcTxErr != pgx.ErrNoRows {
			log.Err(erpcTxErr).Msg("err encountered while querying erpc DB")
			err := error.NewHttpError(
				"error encountered while querying for data",
				"",
				http.StatusInternalServerError,
			)
			return nil, &err
		}
	} else {
		txHashBytes = common.HexToHash(erpcTX.EncryptedTxHash).Bytes()
	}

	tse, err := uc.observerDBQuery.QueryTransactionDetailsByTxHash(ctx, txHashBytes)
	if err != nil {
		log.Err(err).Msg("err encountered while querying observer DB")
		if err == pgx.ErrNoRows {
			err := error.NewHttpError(
				"transaction for provided tx hash not found",
				"",
				http.StatusNotFound,
			)
			return nil, &err
		}
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}

	var effectiveInclusionTime int64
	var inclusionSlot int64
	txStatus := Pending
	if tse.TxStatus.Valid {
		if tse.TxStatus.TxStatusVal == data.TxStatusValIncluded {
			txStatus = Completed
			effectiveInclusionTime = tse.DecryptedTxCreatedAtUnix
			if tse.Slot.Valid {
				inclusionSlot = tse.Slot.Int64
			}
		} else if tse.TxStatus.TxStatusVal == data.TxStatusValNotincluded {
			txStatus = DecryptionKeyGenerated
		}
	}

	totalRegisteredValidators, err := uc.observerDBQuery.QueryTotalRegisteredValidators(ctx)
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}
	totalGnosisValidatorsStringified := os.Getenv("TOTAL_GNOSIS_VALIDATORS")
	totalGnosisValidators, err := strconv.Atoi(totalGnosisValidatorsStringified)
	if err != nil {
		log.Err(err).Msg("err encountered while parsing total gnosis validators")
		err := error.NewHttpError(
			"error encountered while parsing",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}

	slotDurationStringified := os.Getenv("SLOT_DURATION")
	slotDuration, err := strconv.Atoi(slotDurationStringified)
	if err != nil {
		log.Err(err).Msg("err encountered while parsing slot duration")
		err := error.NewHttpError(
			"error encountered while parsing",
			"",
			http.StatusInternalServerError,
		)
		return nil, &err
	}
	estimatedInclusionTime := (int64(totalGnosisValidators) / totalRegisteredValidators) * int64(slotDuration)

	var userTxHash string
	if len(tse.UserTxHash) > 0 {
		userTxHash = "0x" + hex.EncodeToString(tse.UserTxHash)
	} else {
		if erpcTxErr == nil {
			userTxHash = erpcTX.UserTxHash
		}
	}

	//notice: EstimatedInclusionTime is always going to be current inclusion time at the time of the query
	resp := &QueryTransactionDetailResp{
		Sender:                 "0x" + hex.EncodeToString(tse.Sender),
		SequencerTxHash:        "0x" + hex.EncodeToString(tse.EventTxHash),
		UserTxHash:             userTxHash,
		TxStatus:               string(txStatus),
		InclusionSlot:          inclusionSlot,
		SequencerTxSubmittedAt: int64(tse.CreatedAtUnix),
		DecryptedTxCreatedAt:   tse.DecryptedTxCreatedAtUnix,
		EffectiveInclusionTime: effectiveInclusionTime,
		EstimatedInclusionTime: estimatedInclusionTime,
	}
	return resp, nil
}

func (uc *TransactionUsecase) QueryLatestSequencerTransactions(ctx context.Context, limit string) ([]data.QueryLatestSequencerTransactionsRow, *error.Http) {
	txLimit, err := strconv.Atoi(limit)
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"unable to decode limit",
			"valid limit query parameter is required",
			http.StatusBadRequest,
		)
		return nil, &err
	}

	txs, err := uc.observerDBQuery.QueryLatestSequencerTransactions(ctx, int32(txLimit))
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
