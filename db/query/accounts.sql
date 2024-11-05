-- name: GetAccount :one
SELECT * FROM accounts WHERE id = $1;

-- name: GetAccounts :many
SELECT * FROM accounts;

-- name: CreateAccount :one
INSERT INTO accounts (name, region) VALUES ($1, $2) 
RETURNING *;

-- name: DeleteAccount :one
DELETE FROM accounts WHERE id = $1 
RETURNING *;