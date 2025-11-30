package main

import (
	"my-backend/database"
	"my-backend/handlers"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	// พยายามต่อ DB ตอนเริ่ม แต่ถ้าไม่มีไฟล์ก็ไม่ Error แค่ DB=nil
	database.Connect()

	app := fiber.New()

	// Setup CORS ให้ Frontend (Electron) เรียกได้
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	api := app.Group("/api")

	// Endpoints
	api.Get("/status", handlers.CheckStatus)
	api.Post("/setup", handlers.SaveSetup)
	api.Post("/login", func(c *fiber.Ctx) error {
		// Mock Login
		return c.JSON(fiber.Map{"message": "Login logic here"})
	})

	app.Listen(":8080")
}
