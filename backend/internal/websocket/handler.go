package websocket

import (
	"context"
	"time"

	"github.com/shutter-network/shutter-explorer/backend/internal/error"
)

type WebsocketResponse struct {
	Type  WebsocketEventType
	Data  any
	Error *error.Http
}

type WebsocketEventType string

const (
	TotalExecutedTransactions   WebsocketEventType = "total_executed_transactions_updated"
	LatestSequencerTransactions WebsocketEventType = "latest_sequencer_transactions_updated"
	LatestUserTransactions      WebsocketEventType = "latest_user_transactions_updated"
	TotalTransactionsPerMonth   WebsocketEventType = "total_transactions_per_month_updated"
	Top5Epochs                  WebsocketEventType = "top_5_epochs_updated"
)

func (manager *ClientManager) sendTotalExecutedTransactions(ctx context.Context, d time.Duration, txStatus string) {
	callback := func(ctx context.Context) WebsocketResponse {
		totalExecuted, err := manager.usecases.TransactionUsecase.QueryTotalExecutedTXsForEachTXStatus(ctx, txStatus)
		return WebsocketResponse{
			Type:  TotalExecutedTransactions,
			Data:  totalExecuted,
			Error: err,
		}
	}
	go manager.sendPeriodicMessages(ctx, d, callback)
}

func (manager *ClientManager) sendLatestSequencerTransactions(ctx context.Context, d time.Duration, limit string) {
	callback := func(ctx context.Context) WebsocketResponse {
		sequencerTransactions, err := manager.usecases.TransactionUsecase.QueryLatestSequencerTransactions(ctx, limit)
		return WebsocketResponse{
			Type:  LatestSequencerTransactions,
			Data:  sequencerTransactions,
			Error: err,
		}
	}
	go manager.sendPeriodicMessages(ctx, d, callback)
}

func (manager *ClientManager) sendLatestUserTransactions(ctx context.Context, d time.Duration, limit string) {
	callback := func(ctx context.Context) WebsocketResponse {
		includedTransactions, err := manager.usecases.TransactionUsecase.QueryLatestIncludedTransactions(ctx, limit)
		return WebsocketResponse{
			Type:  LatestUserTransactions,
			Data:  includedTransactions,
			Error: err,
		}
	}
	go manager.sendPeriodicMessages(ctx, d, callback)
}

func (manager *ClientManager) sendTotalTXsByTXStatusLast30Days(ctx context.Context, d time.Duration, txStatus string) {
	callback := func(ctx context.Context) WebsocketResponse {
		totalTxs, err := manager.usecases.TransactionUsecase.QueryTotalExecutedTXsForEachTXStatusPerMonth(ctx, txStatus)
		return WebsocketResponse{
			Type:  TotalTransactionsPerMonth,
			Data:  totalTxs,
			Error: err,
		}
	}
	go manager.sendPeriodicMessages(ctx, d, callback)
}

func (manager *ClientManager) sendTop5Epochs(ctx context.Context, d time.Duration) {
	var previousEpoch uint64

	callback := func(ctx context.Context) WebsocketResponse {
		epochsData, futureEpoch, err := manager.usecases.SlotUsecase.QueryTop5Epochs(ctx)
		if err != nil {
			return WebsocketResponse{
				Type:  Top5Epochs,
				Data:  nil,
				Error: err,
			}
		}
		// data hasnt changed
		if futureEpoch == previousEpoch {
			return WebsocketResponse{
				Type:  Top5Epochs,
				Data:  nil,
				Error: nil,
			}
		}
		previousEpoch = futureEpoch

		return WebsocketResponse{
			Type:  Top5Epochs,
			Data:  epochsData,
			Error: err,
		}
	}
	go manager.sendPeriodicMessages(ctx, d, callback)
}
