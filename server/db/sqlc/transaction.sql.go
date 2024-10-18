// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: transaction.sql

package sqlc

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const createTransaction = `-- name: CreateTransaction :one
INSERT INTO transactions (account_id, asset_id, date, type, quantity, price_per_unit, cost, fees, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, account_id, asset_id, date, type, quantity, price_per_unit, cost, fees, notes, created_at, updated_at
`

type CreateTransactionParams struct {
	AccountID    int32     `json:"account_id"`
	AssetID      uuid.UUID `json:"asset_id"`
	Date         time.Time `json:"date"`
	Type         string    `json:"type"`
	Quantity     string    `json:"quantity"`
	PricePerUnit string    `json:"price_per_unit"`
	Cost         string    `json:"cost"`
	Fees         string    `json:"fees"`
	Notes        string    `json:"notes"`
}

func (q *Queries) CreateTransaction(ctx context.Context, arg CreateTransactionParams) (Transaction, error) {
	row := q.db.QueryRowContext(ctx, createTransaction,
		arg.AccountID,
		arg.AssetID,
		arg.Date,
		arg.Type,
		arg.Quantity,
		arg.PricePerUnit,
		arg.Cost,
		arg.Fees,
		arg.Notes,
	)
	var i Transaction
	err := row.Scan(
		&i.ID,
		&i.AccountID,
		&i.AssetID,
		&i.Date,
		&i.Type,
		&i.Quantity,
		&i.PricePerUnit,
		&i.Cost,
		&i.Fees,
		&i.Notes,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getTransactions = `-- name: GetTransactions :many
SELECT 
accounts.Name AS account,
assets.Name AS asset,
transactions.ID AS id, 
transactions.Date AS date,
transactions.Type AS type,
transactions.Quantity AS quantity,
transactions.Price_Per_Unit AS price_per_unit,
transactions.Cost AS cost,
transactions.Fees AS fees,
transactions.Notes AS notes
FROM transactions
INNER JOIN assets ON transactions.asset_id = assets.id
INNER JOIN accounts ON transactions.account_id = accounts.id
ORDER BY date DESC
`

type GetTransactionsRow struct {
	Account      string    `json:"account"`
	Asset        string    `json:"asset"`
	ID           uuid.UUID `json:"id"`
	Date         time.Time `json:"date"`
	Type         string    `json:"type"`
	Quantity     string    `json:"quantity"`
	PricePerUnit string    `json:"price_per_unit"`
	Cost         string    `json:"cost"`
	Fees         string    `json:"fees"`
	Notes        string    `json:"notes"`
}

func (q *Queries) GetTransactions(ctx context.Context) ([]GetTransactionsRow, error) {
	rows, err := q.db.QueryContext(ctx, getTransactions)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetTransactionsRow
	for rows.Next() {
		var i GetTransactionsRow
		if err := rows.Scan(
			&i.Account,
			&i.Asset,
			&i.ID,
			&i.Date,
			&i.Type,
			&i.Quantity,
			&i.PricePerUnit,
			&i.Cost,
			&i.Fees,
			&i.Notes,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
