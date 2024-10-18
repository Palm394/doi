-- name: GetTransactions :many
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
ORDER BY date DESC;

-- name: CreateTransaction :one
INSERT INTO transactions (account_id, asset_id, date, type, quantity, price_per_unit, cost, fees, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;