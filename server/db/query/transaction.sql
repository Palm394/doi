-- name: CreateTransaction :one
INSERT INTO transactions (account_id, asset_id, date, type, quantity, price_per_unit, cost, fees, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;