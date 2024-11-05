-- name: GetAssets :many
SELECT * FROM assets;

-- name: GetAssetByID :one
SELECT * FROM assets WHERE id = $1;

-- name: GetAssetByName :one
SELECT * FROM assets WHERE name = $1;

-- name: CreateAsset :one
INSERT INTO assets (name, type) VALUES ($1, $2) RETURNING *;