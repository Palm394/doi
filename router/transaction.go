package router

import (
	"context"
	"database/sql"
	"time"

	"github.com/Palm394/fire/db"
	"github.com/Palm394/fire/db/sqlc"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

func Transaction(router fiber.Router) {
	router.Get("/", getTransactions)
	router.Post("/", createTransaction)
	router.Delete("/:id", deleteTransaction)
}

type transactionRequestParams struct {
	AccountID    int32     `json:"accountID"`
	AssetID      uuid.UUID `json:"assetID"`
	Date         time.Time `json:"date"`
	Type         string    `json:"transactionType"`
	Quantity     float64   `json:"quantity"`
	PricePerUnit float64   `json:"price_per_unit"`
	Fees         float64   `json:"fees"`
	Notes        string    `json:"notes"`
}

func getTransactions(c *fiber.Ctx) error {
	transactions, err := db.Queries.GetTransactions(context.Background())
	if err != nil {
		if err == sql.ErrNoRows {
			return c.SendStatus(fiber.StatusNotFound)
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}
	return c.JSON(fiber.Map{
		"success": true,
		"data":    transactions,
	})
}

func createTransaction(c *fiber.Ctx) error {
	var body transactionRequestParams
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}
	if body.AccountID == 0 || body.AssetID == uuid.Nil || body.Date == (time.Time{}) || body.Type == "" || body.Quantity <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Some property in body is not valid",
		})
	}
	input_quantity := decimal.NewFromFloat(body.Quantity)
	_ = decimal.NewFromFloat(body.PricePerUnit)
	fees := decimal.NewFromFloat(body.Fees)

	_, err := db.Queries.GetAssetByID(context.Background(), body.AssetID)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "AssetID doesn't exists",
			})
		}
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}
	_, err = db.Queries.GetAccount(context.Background(), int32(body.AccountID))
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "AccountID doesn't exists",
			})
		}
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "AccountID doesn't exists",
		})
	}

	account_asset, err := db.Queries.GetAccountAssets(context.Background(), sqlc.GetAccountAssetsParams{
		AccountID: body.AccountID,
		AssetID:   body.AssetID,
	})
	if err != nil && err != sql.ErrNoRows {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}
	if err == sql.ErrNoRows {
		account_asset, err = db.Queries.CreateAccountAsset(context.Background(), sqlc.CreateAccountAssetParams{
			AccountID:   body.AccountID,
			AssetID:     body.AssetID,
			Quantity:    decimal.Zero.String(),
			AverageCost: decimal.Zero.String(),
		})
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		}
	}
	database_quantity, err := decimal.NewFromString(account_asset.Quantity)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}
	switch body.Type {
	case "deposit":
		sum_quantity := input_quantity.Add(database_quantity).Sub(fees)
		err = db.WithTx(context.Background(), func(q *sqlc.Queries) error {
			_, err = q.CreateTransaction(context.Background(), sqlc.CreateTransactionParams{
				AccountID:    body.AccountID,
				AssetID:      body.AssetID,
				Date:         body.Date,
				Type:         "deposit",
				Quantity:     input_quantity.String(),
				PricePerUnit: "1",
				Cost:         input_quantity.Add(fees).String(),
				Fees:         fees.String(),
				Notes:        body.Notes,
			})
			if err != nil {
				return &fiber.Error{
					Message: "Deposit: Failed to create transaction",
				}
			}
			_, err = q.UpdateAccountAsset(context.Background(), sqlc.UpdateAccountAssetParams{
				AccountID:   body.AccountID,
				AssetID:     body.AssetID,
				Quantity:    sum_quantity.String(),
				AverageCost: sum_quantity.String(),
			})
			if err != nil {
				return &fiber.Error{
					Message: "Deposit: Failed to update account asset",
				}
			}
			return nil
		})
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		}
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Successfully create deposit transaction",
		})
	case "withdraw":
		left_quantity := database_quantity.Sub(input_quantity).Sub(fees)
		cost := input_quantity.Sub(fees)
		if left_quantity.LessThan(decimal.Zero) || cost.LessThan(decimal.Zero) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Your current balance is lower than the requested withdrawal amount.",
			})
		}
		err := db.WithTx(context.Background(), func(q *sqlc.Queries) error {
			_, err = q.CreateTransaction(context.Background(), sqlc.CreateTransactionParams{
				AccountID:    body.AccountID,
				AssetID:      body.AssetID,
				Date:         body.Date,
				Type:         "withdraw",
				Quantity:     input_quantity.String(),
				PricePerUnit: "1",
				Cost:         cost.String(),
				Fees:         fees.String(),
				Notes:        body.Notes,
			})
			if err != nil {
				return &fiber.Error{
					Message: "Withdraw: Failed to create transaction",
				}
			}
			_, err = q.UpdateAccountAsset(context.Background(), sqlc.UpdateAccountAssetParams{
				AccountID:   body.AccountID,
				AssetID:     body.AssetID,
				Quantity:    left_quantity.String(),
				AverageCost: left_quantity.String(),
			})
			if err != nil {
				return &fiber.Error{
					Message: "Withdraw: Failed to update account asset",
				}
			}
			return nil
		})
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		}
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Successfully create withdraw transaction",
		})
	}
	return c.SendStatus(503)
}

func deleteTransaction(c *fiber.Ctx) error {
	uuid, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.JSON(fiber.Map{
			"success": false,
			"message": "Failed to convert params to UUID",
		})
	}
	transaction, err := db.Queries.GetTransaction(context.Background(), uuid)
	if err == sql.ErrNoRows {
		return c.JSON(fiber.Map{
			"success": false,
			"message": "Transaction not found",
		})
	}
	if err != nil {
		return c.JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}
	account_asset, err := db.Queries.GetAccountAssets(context.Background(), sqlc.GetAccountAssetsParams{
		AccountID: transaction.AccountID,
		AssetID:   transaction.AssetID,
	})
	if err == sql.ErrNoRows {
		return c.JSON(fiber.Map{
			"success": false,
			"message": "Account asset not found",
		})
	}
	if err != nil {
		return c.JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}
	account_asset_quantity, err := decimal.NewFromString(account_asset.Quantity)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to convert account asset quantity to decimal",
		})
	}
	transaction_cost, err := decimal.NewFromString(transaction.Cost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to convert transaction cost to decimal",
		})
	}
	switch transaction.Type {
	case "deposit":
		if account_asset_quantity.LessThan(transaction_cost) {
			return c.JSON(fiber.Map{
				"success": false,
				"message": "Account asset quantity is lower than transaction cost",
			})
		}
		err = db.WithTx(context.Background(), func(q *sqlc.Queries) error {
			new_quantity := account_asset_quantity.Sub(transaction_cost)
			_, err := db.Queries.UpdateAccountAsset(context.Background(), sqlc.UpdateAccountAssetParams{
				AccountID:   transaction.AccountID,
				AssetID:     transaction.AssetID,
				Quantity:    new_quantity.String(),
				AverageCost: new_quantity.String(),
			})
			if err != nil {
				return err
			}
			_, err = db.Queries.DeleteTransaction(context.Background(), uuid)
			if err != nil {
				return err
			}
			return nil
		})
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		}
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Successfully delete transaction",
		})
	case "withdraw":
		err = db.WithTx(context.Background(), func(q *sqlc.Queries) error {
			new_quantity := account_asset_quantity.Add(transaction_cost)
			_, err := db.Queries.UpdateAccountAsset(context.Background(), sqlc.UpdateAccountAssetParams{
				AccountID:   transaction.AccountID,
				AssetID:     transaction.AssetID,
				Quantity:    new_quantity.String(),
				AverageCost: new_quantity.String(),
			})
			if err != nil {
				return err
			}
			_, err = db.Queries.DeleteTransaction(context.Background(), uuid)
			if err != nil {
				return err
			}
			return nil
		})
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": "Failed to commit deleting withdraw transaction " + err.Error(),
			})
		}
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Successfully delete transaction",
		})
	}
	return c.SendStatus(fiber.StatusServiceUnavailable)
}
