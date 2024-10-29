-- name: GetAccountAssets :one
SELECT * FROM account_asset WHERE account_id = $1 AND asset_id = $2;

-- name: CreateAccountAsset :one
INSERT INTO account_asset (account_id, asset_id, quantity, average_cost) VALUES ($1, $2, $3, $4) RETURNING *;

-- name: UpdateAccountAsset :one
UPDATE account_asset SET quantity = $3, average_cost = $4 WHERE account_id = $1 AND asset_id = $2 RETURNING *;

-- name: DeleteAccountAsset :one
DELETE FROM account_asset WHERE account_id = $1 AND asset_id = $2 RETURNING *;