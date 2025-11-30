package database

import (
	"encoding/json"
	"fmt"
	"my-backend/models"
	"my-backend/utils"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB
var ConfigFile = "./db_config.json" // ไฟล์ที่จะบันทึก

// ฟังก์ชั่นลองเชื่อมต่อ (ใช้ทดสอบก่อน Save)
func TestConnection(req models.SetupRequest) error {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		req.Username, req.Password, req.Hostname, req.Port, req.DBName)

	_, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	return err
}

// เชื่อมต่อจริงเมื่อเริ่มแอพ
func Connect() error {
	// อ่านไฟล์ Config
	file, err := os.ReadFile(ConfigFile)
	if err != nil {
		return err // ไฟล์ไม่มี หรืออ่านไม่ได้
	}

	var conf models.DBConfig
	json.Unmarshal(file, &conf)

	// ถอดรหัส Password
	decryptedPass, err := utils.Decrypt(conf.Password)
	if err != nil {
		return err
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		conf.Username, decryptedPass, conf.Hostname, conf.Port, conf.DBName)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	DB = db
	fmt.Println("✅ Database Connected Successfully")
	return nil
}
