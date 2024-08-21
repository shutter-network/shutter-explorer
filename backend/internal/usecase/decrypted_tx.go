package usecase

import (
	"encoding/hex"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shutter-network/shutter-explorer/backend/internal/data"
	"github.com/shutter-network/shutter-explorer/backend/internal/error"
)

type DecryptedTxUsecase struct {
	observerDB      *pgxpool.Pool
	erpcDB          *pgxpool.Pool
	observerDBQuery *data.Queries
	erpcDBQuery     *data.Queries
}

func NewDecryptedTxUsecase(
	observerDB *pgxpool.Pool,
	erpcDB *pgxpool.Pool,
) *DecryptedTxUsecase {
	return &DecryptedTxUsecase{
		observerDB:      observerDB,
		observerDBQuery: data.New(observerDB),
		erpcDB:          erpcDB,
		erpcDBQuery:     data.New(erpcDB),
	}
}

func (uc *DecryptedTxUsecase) QueryDecryptedTX(ctx *gin.Context) {
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
