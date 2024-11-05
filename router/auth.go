package router

import (
	"context"

	"github.com/Palm394/fire/config"
	"github.com/Palm394/fire/db"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func Auth(router fiber.Router) {
	router.Post("/login", login)
	router.Post("/logout", logout)
	router.Get("/verify", verify)
}

type loginReq struct {
	Email		string
	Password	string
}

func login(c *fiber.Ctx) error {
	var req loginReq
	err := c.BodyParser(&req)
	if err != nil || req.Email == "" || req.Password == "" {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	// Query password by email
	user, err := db.Queries.GetUserByEmail(context.Background(), req.Email)
	if err != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	// Compare with input password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": req.Email,
	})
	tokenString, err := token.SignedString([]byte(config.EnvFile["JWT_SECRET"]))
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	c.Cookie(&fiber.Cookie{
		Name: "jwt",
		Value: tokenString,
		MaxAge: 60 * 60,
		HTTPOnly: true,
		SameSite: fiber.CookieSameSiteNoneMode,
		Secure: true,
	})
	return c.JSON(fiber.Map{
		"success": true,
	})
}

func verify(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")
	token, err := jwt.Parse(cookie, func(t *jwt.Token) (interface{}, error) {
		return []byte(config.EnvFile["JWT_SECRET"]), nil
	})
	if err != nil || !token.Valid {
		c.Cookie(&fiber.Cookie{
			Name: "jwt",
			MaxAge: -1,
			HTTPOnly: true,
			SameSite: fiber.CookieSameSiteNoneMode,
			Secure: true,
		})
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": err,
		})
	}
	return c.JSON(fiber.Map{
		"success": true,
	})
}

func logout(c *fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{
		Name: "jwt",
		MaxAge: -1,
		HTTPOnly: true,
		SameSite: fiber.CookieSameSiteNoneMode,
		Secure: true,
	})
	return c.JSON(fiber.Map{
		"success": true,
	})	
}