package models

type DBConfig struct {
	Hostname string `json:"hostname"`
	Port     string `json:"port"`
	Username string `json:"username"`
	Password string `json:"password"` // จะถูกเก็บแบบ Encrypted
	DBName   string `json:"database_name"`
}

// Struct สำหรับรับ Request จาก Frontend (Password เป็น Plain text)
type SetupRequest struct {
	Hostname string `json:"hostname"`
	Port     string `json:"port"`
	Username string `json:"username"`
	Password string `json:"password"`
	DBName   string `json:"database_name"`
}
