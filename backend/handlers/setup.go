package handlers

import (
	"encoding/json"
	"my-backend/database"
	"my-backend/models"
	"my-backend/utils"
	"os"

	"github.com/gofiber/fiber/v2"
)

// เช็คว่าเคย Setup หรือยัง และ DB ต่อติดไหม
func CheckStatus(c *fiber.Ctx) error {
	if database.DB == nil {
		// พยายาม Connect อีกรอบเผื่อไฟล์เพิ่งมา
		err := database.Connect()
		if err != nil {
			return c.JSON(fiber.Map{"is_setup": false, "message": "Database not connected"})
		}
	}
	return c.JSON(fiber.Map{"is_setup": true, "message": "Ready"})
}

// บันทึก Setup
func SaveSetup(c *fiber.Ctx) error {
	var req models.SetupRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	// 1. Test Connection ก่อน
	if err := database.TestConnection(req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Connection Failed: " + err.Error()})
	}

	// 2. Encrypt Password
	encryptedPass, err := utils.Encrypt(req.Password)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Encryption failed"})
	}

	// 3. เตรียมข้อมูลลงไฟล์
	configToSave := models.DBConfig{
		Hostname: req.Hostname,
		Port:     req.Port,
		Username: req.Username,
		Password: encryptedPass,
		DBName:   req.DBName,
	}

	fileData, _ := json.MarshalIndent(configToSave, "", "  ")

	// 4. บันทึกไฟล์ .json
	err = os.WriteFile(database.ConfigFile, fileData, 0644)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Cannot write file"})
	}

	// 5. Connect เข้าระบบจริงทันที
	database.Connect()

	return c.JSON(fiber.Map{"success": true, "message": "Configuration saved"})
}
