package router

import (
	"context"
	"strconv"
	"strings"

	"github.com/Palm394/fire/db"
	"github.com/Palm394/fire/db/sqlc"
	"github.com/gofiber/fiber/v2"
)

func Account(router fiber.Router) {
	router.Get("/", getAccounts)
	router.Get("/:id", getAccountById)
	router.Post("/", createAccount)
	router.Put("/:id", updateAccount)
	router.Delete("/:id", deleteAccount)
}

func getAccounts(c *fiber.Ctx) error {
	accounts, err := db.Queries.GetAccounts(context.Background())
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(&fiber.Map{
			"success": false,
		})
	}
	if len(accounts) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(&fiber.Map{
			"success": false,
		})
	}
	return c.JSON(&fiber.Map{
		"success": true,
		"data": accounts,
	})
}

func getAccountById(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
		})
	}
	account, err := db.Queries.GetAccount(context.Background(), int32(id))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
			"success": false,
		})
	}
	// [?] better nil case
	if account.ID == 0 {
		return c.Status(fiber.StatusNotFound).JSON(&fiber.Map{
			"success": false,
		})
	}
	return c.JSON(&fiber.Map{
		"success": true,
		"data": account,
	})
}

func createAccount(c *fiber.Ctx) error {
	var body sqlc.CreateAccountParams 
	err := c.BodyParser(&body)

	if err != nil || body.Name == "" || body.Region == "" {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
		})
	}

	// Validate region

	new_account, err := db.Queries.CreateAccount(context.Background(), body)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"success": false,
				"message": "Account name already exists.",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
			"success": false,
			"message": err,
		})
	}
	return c.Status(fiber.StatusCreated).JSON(&fiber.Map{
		"success": true,
		"data": new_account,
	})
}

func updateAccount(c *fiber.Ctx) error {
	return c.SendStatus(fiber.StatusNotImplemented)
}

func deleteAccount(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
		})
	}
	_, err = db.Queries.DeleteAccount(context.Background(), int32(id))
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	return c.SendStatus(fiber.StatusNoContent)
}
