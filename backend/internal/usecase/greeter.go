package usecase

//example usecase

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shutter-network/shutter-explorer/backend/internal/data"
)

type GreeterUsecase struct {
	db      *pgxpool.Pool
	dbQuery *data.Queries
}

func NewGreeterUsecase(
	db *pgxpool.Pool,
) *GreeterUsecase {
	return &GreeterUsecase{
		db:      db,
		dbQuery: data.New(db),
	}
}

func (uc *GreeterUsecase) QueryGreeter(ctx *gin.Context) {
	// do any business logic and computations here
	uc.dbQuery.QueryGreeter(ctx.Request.Context())
}
