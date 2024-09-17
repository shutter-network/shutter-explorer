package websocket

import (
	"context"
	"time"

	"github.com/shutter-network/shutter-explorer/backend/internal/error"
)

func (manager *ClientManager) sendLatestPendingTransaction(ctx context.Context, d time.Duration, txLimit string) {
	callback := func(ctx context.Context) (interface{}, *error.Http) {
		return manager.usecases.TransactionUsecase.QueryLatestPendingTransactions(ctx, txLimit)
	}
	go manager.sendPeriodicMessages(ctx, d, callback)
}

func (manager *ClientManager) sendTotalExecutedTXs(ctx context.Context, d time.Duration, txStatus string) {
	callback := func(ctx context.Context) (interface{}, *error.Http) {
		return manager.usecases.TransactionUsecase.QueryTotalExecutedTXsForEachTXStatus(ctx, txStatus)
	}
	go manager.sendPeriodicMessages(ctx, d, callback)
}
