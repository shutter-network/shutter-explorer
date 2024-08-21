package database

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
)

type SortDirection string

const (
	DESC SortDirection = "DESC"
	ASC  SortDirection = "ASC"
)

func NewDB(ctx context.Context, dbURL string) (*pgxpool.Pool, error) {
	dbpool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		return nil, errors.Wrap(err, "failed to connect to database")
	}

	if err = dbpool.Ping(ctx); err != nil {
		log.Err(err).
			Msg("Unable to ping database")
		return nil, err
	}

	return dbpool, nil
}

func GetObserverDBURL() string {
	var (
		host     = os.Getenv("OBSERVER_DB_HOST")
		port     = os.Getenv("OBSERVER_DB_PORT")
		user     = os.Getenv("OBSERVER_DB_USER")
		password = os.Getenv("OBSERVER_DB_PASSWORD")
		dbName   = os.Getenv("OBSERVER_DB_NAME")
		sslMode  = os.Getenv("OBSERVER_DB_SSL_MODE")
	)
	dbAddr := fmt.Sprintf("%s:%s", host, port)
	if sslMode == "" {
		sslMode = "disable"
	}
	databaseURL := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=%s", user, password, dbAddr, dbName, sslMode)
	return databaseURL
}

func GetERPCDBURL() string {
	var (
		host     = os.Getenv("ERPC_DB_HOST")
		port     = os.Getenv("ERPC_DB_PORT")
		user     = os.Getenv("ERPC_DB_USER")
		password = os.Getenv("ERPC_DB_PASSWORD")
		dbName   = os.Getenv("ERPC_DB_NAME")
		sslMode  = os.Getenv("ERPC_DB_SSL_MODE")
	)
	dbAddr := fmt.Sprintf("%s:%s", host, port)
	if sslMode == "" {
		sslMode = "disable"
	}
	databaseURL := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=%s", user, password, dbAddr, dbName, sslMode)
	return databaseURL
}
