-- name: GetAccountAssets :one
SELECT * FROM account_asset WHERE account_id = $1 AND asset_id = $2;

-- name: CreateAccountAsset :one
INSERT INTO account_asset (account_id, asset_id, quantity, average_cost) VALUES ($1, $2, $3, $4) RETURNING *;

-- name: UpdateAccountAsset :one
UPDATE account_asset SET quantity = $3, average_cost = $4 WHERE account_id = $1 AND asset_id = $2 RETURNING *;

-- name: DeleteAccountAsset :one
DELETE FROM account_asset WHERE account_id = $1 AND asset_id = $2 RETURNING *;

-- name: GetAllCashAccount :many
SELECT accounts.name, account_asset.quantity, assets.current_value, assets.current_value_currency FROM
accounts LEFT JOIN
account_asset LEFT JOIN assets ON account_asset.asset_id = assets.id AND assets.type = 'CASH'
ON accounts.id = account_asset.account_id;