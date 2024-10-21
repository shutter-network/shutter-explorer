package usecase

import (
	"context"
	"encoding/hex"
	"fmt"
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
	Submitted              TxStatus = "Submitted"
	PendingUserTransaction TxStatus = "Pending user transaction"
	Invalid                TxStatus = "Invalid"
	CannotBeDecrypted      TxStatus = "Cannot be decrypted"
	ShieldedInclusion      TxStatus = "Shielded inclusion"
	UnshieldedInclusion    TxStatus = "Unshielded inclusion"
	NotIncluded            TxStatus = "Not included"
)

const GnosisTransactionsPerMonth float64 = 3097145

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
	InclusionSlot          *int64
	SequencerTxSubmittedAt int64
	DecryptedTxCreatedAt   int64
	InclusionTime          *int64
	InclusionDelay         *int64
	BlockNumber            *int64
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

func (uc *TransactionUsecase) QueryTotalExecutedTXsForEachTXStatusPerMonth(ctx context.Context, txStatus string) (int64, *error.Http) {
	totalTxs, err := uc.observerDBQuery.QueryTotalTXsForEachTXStatusLast30Days(ctx, data.TxStatusVal(txStatus))
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
		if len(erpcTX) > 0 {
			if txHash == erpcTX[0].EncryptedTxHash {
				fmt.Println("encrypted tx enc called")
				txHashBytes = common.HexToHash(erpcTX[0].EncryptedTxHash).Bytes()
			} else {
				fmt.Println("user tx enc called")
				txHashBytes = common.HexToHash(erpcTX[0].UserTxHash).Bytes()
			}
		}
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

	var inclusionTime *int64
	var inclusionSlot *int64
	var inclusionDelay *int64
	var blockNumber *int64
	txStatus := Submitted
	if tse.TxStatus.Valid {
		if tse.TxStatus.TxStatusVal == data.TxStatusValShieldedinclusion {
			txStatus = ShieldedInclusion
			inclusionTime = &tse.DecryptedTxUpdatedAtUnix
			sub := *inclusionTime - tse.CreatedAt.Time.Unix()
			inclusionDelay = &sub
			if tse.Slot.Valid {
				inclusionSlot = &tse.Slot.Int64
			}
			if tse.BlockNumber.Valid {
				blockNumber = &tse.BlockNumber.Int64
			}
		} else if tse.TxStatus.TxStatusVal == data.TxStatusValUnshieldedinclusion {
			txStatus = UnshieldedInclusion
			inclusionTime = &tse.DecryptedTxUpdatedAtUnix
			sub := *inclusionTime - tse.CreatedAt.Time.Unix()
			inclusionDelay = &sub
		} else if tse.TxStatus.TxStatusVal == data.TxStatusValInvalid {
			txStatus = Invalid
		} else if tse.TxStatus.TxStatusVal == data.TxStatusValPending {
			txStatus = PendingUserTransaction
		} else if tse.TxStatus.TxStatusVal == data.TxStatusValNotdecrypted {
			txStatus = CannotBeDecrypted
		} else if tse.TxStatus.TxStatusVal == data.TxStatusValNotincluded {
			txStatus = NotIncluded
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

	if txStatus == Submitted || txStatus == PendingUserTransaction {
		duration := (int64(totalGnosisValidators) / totalRegisteredValidators) * int64(slotDuration)
		inclusionDelay = &duration
		sub := tse.CreatedAt.Time.Unix() + *inclusionDelay
		inclusionTime = &sub
	}

	var userTxHash string
	if len(tse.UserTxHash) > 0 {
		userTxHash = "0x" + hex.EncodeToString(tse.UserTxHash)
	} else {
		if len(erpcTX) > 0 {
			userTxHash = erpcTX[0].UserTxHash
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
		InclusionTime:          inclusionTime,
		InclusionDelay:         inclusionDelay,
		BlockNumber:            blockNumber,
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

func (uc *TransactionUsecase) QueryTransactionPercentage(ctx context.Context, txStatus string) (float64, *error.Http) {
	totalTxs, err := uc.observerDBQuery.QueryTotalTXsForEachTXStatusLast30Days(ctx, data.TxStatusVal(txStatus))
	if err != nil {
		log.Err(err).Msg("err encountered while querying DB")
		err := error.NewHttpError(
			"error encountered while querying for data",
			"",
			http.StatusInternalServerError,
		)
		return 0, &err
	}

	percentage := (float64(totalTxs) / GnosisTransactionsPerMonth) * 100
	return percentage, nil
}
