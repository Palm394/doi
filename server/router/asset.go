package router

import (
	"context"
	"strings"

	"github.com/Palm394/fire/db"
	"github.com/Palm394/fire/db/sqlc"
	"github.com/gofiber/fiber/v2"
)

var AssetType = []string{
	"CASH",
	"STOCK",
}
var Currency = []string{
	"THB",
	"USD",
}

func Asset(router fiber.Router) {
	router.Get("/", getAssets)
	router.Post("/", createAsset)
	router.Patch("/current_price", updateCurrentPrice)
}

func getAssets(c *fiber.Ctx) error {
	assets, err := db.Queries.GetAssets(context.Background())
	if err != nil || len(assets) == 0 {
		return c.SendStatus(fiber.StatusNotFound)
	}
	return c.JSON(&fiber.Map{
		"success": true,
		"data": assets,
	})
}

func createAsset(c *fiber.Ctx) error {
	var body sqlc.CreateAssetParams
	if err := c.BodyParser(&body); err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	if len(body.Name) == 0 || !isValidAssetType(body.Type.String) {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	
	new_asset, err := db.Queries.CreateAsset(context.Background(), body)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"success": false,
				"message": "Asset's name already exists.",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
			"success": false,
			"message": "Failed to create asset with database",
		})
	}

	return c.JSON(&fiber.Map{
		"success": true,
		"data": new_asset,
	})
}

func updateCurrentPrice(c *fiber.Ctx) error {
	return c.SendStatus(fiber.StatusNotImplemented)
}

func isValidAssetType(assetType string) bool {
	if len(assetType) == 0 {
		return false
	}
	if assetType == "" {
		return true
	}
	for _, validAsset := range AssetType {
		if validAsset == assetType {
			return true
		}
	}
	return false
}

// func isValidCurrency(currency string) bool {
// 	if len(currency) == 0 {
// 		return false
// 	}
// 	for _, validCurrency := range Currency {
// 		if validCurrency == currency {
// 			return true
// 		}
// 	}
// 	return false
// }