package router

import (
	"context"
	"database/sql"
	"fmt"
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
		_, err = db.Queries.CreateAccountAsset(context.Background(), sqlc.CreateAccountAssetParams{
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

	switch body.Type {
	case "deposit":
		database_quantity, err := decimal.NewFromString(account_asset.Quantity)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		}
		sum_quantity := input_quantity.Add(database_quantity)
		err = db.WithTx(context.Background(), func(q *sqlc.Queries) error {
			_, err = db.Queries.CreateTransaction(context.Background(), sqlc.CreateTransactionParams{
				AccountID:    body.AccountID,
				AssetID:      body.AssetID,
				Date:         body.Date,
				Type:         "deposit",
				Quantity:     input_quantity.String(),
				PricePerUnit: "1",
				Cost:         input_quantity.String(),
				Fees:         fees.String(),
				Notes:        body.Notes,
			})
			if err != nil {
				fmt.Println("Deposit: Failed to create transaction")
				return err
			}
			_, err = db.Queries.UpdateAccountAsset(context.Background(), sqlc.UpdateAccountAssetParams{
				AccountID:   body.AccountID,
				AssetID:     body.AssetID,
				Quantity:    sum_quantity.String(),
				AverageCost: sum_quantity.String(),
			})
			if err != nil {
				fmt.Println("Deposit: Failed to update account asset")
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
			"message": "Successfully create transaction",
		})
	case "withdraw":
		fmt.Println("withdraw")
	}
	return c.SendStatus(503)
}
