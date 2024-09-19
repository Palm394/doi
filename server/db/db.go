package db

import (
	"database/sql"
	"log"

	"github.com/Palm394/fire/config"
	"github.com/Palm394/fire/db/sqlc"
	_ "github.com/lib/pq"
)

var (
	conn *sql.DB
	Queries *sqlc.Queries
)

func ConnectDatabase() {
	conn, err := sql.Open("postgres", config.EnvFile["POSTGRES_URL"])
	if err != nil {
		log.Fatal("Failed to connect database", err)
	}
	Queries = sqlc.New(conn)
}

func CloseDatabase() {
	conn.Close()
}