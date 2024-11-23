// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package sqlc

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type Account struct {
	ID     int32  `json:"id"`
	Name   string `json:"name"`
	Region string `json:"region"`
}

type AccountAsset struct {
	AccountID   int32     `json:"account_id"`
	AssetID     uuid.UUID `json:"asset_id"`
	Quantity    string    `json:"quantity"`
	AverageCost string    `json:"average_cost"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Asset struct {
	ID                   uuid.UUID      `json:"id"`
	Name                 string         `json:"name"`
	Type                 sql.NullString `json:"type"`
	CurrentValue         sql.NullString `json:"current_value"`
	CurrentValueCurrency sql.NullString `json:"current_value_currency"`
	CreatedAt            time.Time      `json:"created_at"`
	UpdatedAt            time.Time      `json:"updated_at"`
}

type Transaction struct {
	ID           uuid.UUID `json:"id"`
	AccountID    int32     `json:"account_id"`
	AssetID      uuid.UUID `json:"asset_id"`
	Date         time.Time `json:"date"`
	Type         string    `json:"type"`
	Quantity     string    `json:"quantity"`
	PricePerUnit string    `json:"price_per_unit"`
	Cost         string    `json:"cost"`
	Fees         string    `json:"fees"`
	Notes        string    `json:"notes"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type User struct {
	ID       int32  `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
}