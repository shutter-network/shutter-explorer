package main

import (
	"context"
	"os"

	"github.com/rs/zerolog/log"
	"github.com/shutter-network/shutter-explorer/backend/common/database"
	"github.com/shutter-network/shutter-explorer/backend/internal/usecase"
	"github.com/shutter-network/shutter-explorer/backend/router"
)

func main() {
	port := os.Getenv("SERVER_PORT")

	ctx := context.Background()
	db, err := database.NewDB(ctx)
	if err != nil {
		log.Info().Err(err).Msg("failed to initialize db")
		return
	}
	usecases := usecase.NewUsecases(db)
	app := router.NewRouter(usecases)
	app.Run("0.0.0.0" + port)
}
