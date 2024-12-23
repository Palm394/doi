package db

import (
	"context"
	"database/sql"
	"log"

	"github.com/Palm394/fire/config"
	"github.com/Palm394/fire/db/sqlc"
	_ "github.com/lib/pq"
)

var (
	conn    *sql.DB
	Queries *sqlc.Queries
)

func ConnectDatabase() {
	var err error
	conn, err = sql.Open("postgres", config.EnvFile["POSTGRES_URL"])
	if err != nil {
		log.Fatal("Failed to connect database", err)
	}
	Queries = sqlc.New(conn)
}

func CloseDatabase() {
	conn.Close()
}

func WithTx(ctx context.Context, fn func(*sqlc.Queries) error) error {
	tx, err := conn.BeginTx(ctx, nil)
	defer tx.Rollback()
	if err != nil {
		return err
	}
	q := sqlc.New(tx)
	err = fn(q)
	if err != nil {
		return err
	}
	return tx.Commit()
}
