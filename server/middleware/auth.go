package middleware

import (
	"github.com/Palm394/fire/config"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func AuthRequired(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")
	token, err := jwt.Parse(cookie, func(t *jwt.Token) (interface{}, error) {
		return []byte(config.EnvFile["JWT_SECRET"]), nil
	})
	if err != nil || !token.Valid {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	return c.Next()
}