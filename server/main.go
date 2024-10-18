package main

import (
	"github.com/Palm394/fire/config"
	"github.com/Palm394/fire/db"
	"github.com/Palm394/fire/middleware"
	"github.com/Palm394/fire/router"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowCredentials: true,
	}))

	config.EnvFile, _ = godotenv.Read(".env.local")
	db.ConnectDatabase()
	defer db.CloseDatabase()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello FIRE!")
	})

	api := app.Group("/api")

	api.Route("/auth", router.Auth)
	// auth middleware
	api.Use("/", middleware.AuthRequired)

	api.Route("/account", router.Account)
	api.Route("/asset", router.Asset)
	api.Route("/transaction", router.Transaction)

	app.Listen("127.0.0.1:8080")
}