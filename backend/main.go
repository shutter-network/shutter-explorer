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
	observerDBURL := database.GetObserverDBURL()
	observerDB, err := database.NewDB(ctx, observerDBURL)
	if err != nil {
		log.Info().Err(err).Msg("failed to initialize db")
		return
	}
	erpcDBURL := database.GetERPCDBURL()
	erpcDB, err := database.NewDB(ctx, erpcDBURL)
	if err != nil {
		log.Info().Err(err).Msg("failed to initialize db")
		return
	}
	usecases := usecase.NewUsecases(observerDB, erpcDB)
	app := router.NewRouter(ctx, usecases)
	app.Run("0.0.0.0:" + port)
}
