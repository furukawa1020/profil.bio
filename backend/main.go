package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Models
type Article struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Title       string `json:"title"`
	Content     string `json:"content"`
	Language    string `json:"language"`
	Author      string `json:"author"`
	ConvictionCount int `json:"conviction_count"`
	CreatedAt   time.Time `json:"created_at"`
}

type Visitor struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	Name      string `json:"name"`
	Avatar    string `json:"avatar"`
	IsOnline  bool   `json:"is_online"`
	LastSeen  time.Time `json:"last_seen"`
}

type ConvictionMeter struct {
	ID       uint `json:"id" gorm:"primaryKey"`
	Count    int  `json:"count"`
	LastHit  time.Time `json:"last_hit"`
}

type AICharacterResponse struct {
	Character  string    `json:"character"`
	Response   string    `json:"response"`
	Emotion    string    `json:"emotion"`
	Confidence float32   `json:"confidence"`
	Timestamp  time.Time `json:"timestamp"`
}

type PhilosophyAnalysis struct {
	ID            string   `json:"id"`
	Text          string   `json:"text"`
	Themes        []string `json:"themes"`
	Sentiment     string   `json:"sentiment"`
	Complexity    float32  `json:"complexity"`
	Recommendations []string `json:"recommendations"`
}

// Internal SNS Models
type InternalPost struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	Title         string    `json:"title"`
	Content       string    `json:"content"`
	Category      string    `json:"category"`
	AuthorID      string    `json:"author_id"`
	LikesCount    int       `json:"likes_count"`
	CommentsCount int       `json:"comments_count"`
	ConvictionMeter int     `json:"conviction_meter"`
	CreatedAt     time.Time `json:"created_at"`
}

type InternalUser struct {
	ID              string    `json:"id" gorm:"primaryKey"`
	Username        string    `json:"username"`
	DisplayName     string    `json:"display_name"`
	Bio             string    `json:"bio"`
	AvatarURL       string    `json:"avatar_url"`
	PhilosophyLevel int       `json:"philosophy_level"`
	ConvictionPoints int      `json:"conviction_points"`
	CreatedAt       time.Time `json:"created_at"`
}

// WebSocket upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Database
var db *gorm.DB

// Service URLs - 環境変数から取得
var (
	AI_SERVICE_URL  = getEnvWithDefault("RUST_AI_URL", "http://localhost:3001")
	SNS_SERVICE_URL = getEnvWithDefault("PYTHON_SNS_URL", "http://localhost:3002")
)

func getEnvWithDefault(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func initDatabase() {
	var err error
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=password dbname=philosophy_playground port=5432 sslmode=disable"
	}
	
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate
	db.AutoMigrate(&Article{}, &Visitor{}, &ConvictionMeter{}, &InternalPost{}, &InternalUser{})
}

// AI Service Integration
func callAIService(endpoint string, data interface{}) (map[string]interface{}, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	resp, err := http.Post(AI_SERVICE_URL+endpoint, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	return result, err
}

// SNS Service Integration
func callSNSService(method, endpoint string, data interface{}) (map[string]interface{}, error) {
	var req *http.Request
	var err error

	if data != nil {
		jsonData, err := json.Marshal(data)
		if err != nil {
			return nil, err
		}
		req, err = http.NewRequest(method, SNS_SERVICE_URL+endpoint, bytes.NewBuffer(jsonData))
	} else {
		req, err = http.NewRequest(method, SNS_SERVICE_URL+endpoint, nil)
	}

	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	return result, err
}

// Handlers
func getArticles(c *gin.Context) {
	var articles []Article
	db.Find(&articles)
	c.JSON(http.StatusOK, gin.H{"articles": articles})
}

func createArticle(c *gin.Context) {
	var article Article
	if err := c.ShouldBindJSON(&article); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	article.CreatedAt = time.Now()
	db.Create(&article)
	
	// AI分析を並行実行
	go func() {
		analysisData := map[string]interface{}{
			"text": article.Content,
		}
		analysis, err := callAIService("/analyze", analysisData)
		if err != nil {
			log.Printf("AI analysis failed: %v", err)
		} else {
			log.Printf("AI analysis result: %v", analysis)
		}
	}()
	
	c.JSON(http.StatusCreated, article)
}

func incrementConviction(c *gin.Context) {
	var meter ConvictionMeter
	db.FirstOrCreate(&meter, ConvictionMeter{ID: 1})
	
	meter.Count++
	meter.LastHit = time.Now()
	db.Save(&meter)
	
	// サイト全体に光るエフェクトを送信（WebSocket経由）
	broadcastConvictionUpdate(meter.Count)
	
	c.JSON(http.StatusOK, gin.H{
		"count": meter.Count,
		"message": "納得度が上がりました！サイトが光ります✨",
		"light_effect": meter.Count > 5,
	})
}

func getConvictionMeter(c *gin.Context) {
	var meter ConvictionMeter
	db.FirstOrCreate(&meter, ConvictionMeter{ID: 1})
	
	c.JSON(http.StatusOK, meter)
}

// 新しいAI統合エンドポイント
func chatWithCharacter(c *gin.Context) {
	var request struct {
		Character string `json:"character"`
		Message   string `json:"message"`
		Context   string `json:"context,omitempty"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	response, err := callAIService("/chat", request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI service unavailable"})
		return
	}
	
	c.JSON(http.StatusOK, response)
}

func analyzePhilosophy(c *gin.Context) {
	var request struct {
		Text string `json:"text"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	response, err := callAIService("/analyze", request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI service unavailable"})
		return
	}
	
	c.JSON(http.StatusOK, response)
}

func getCharacterPersonalities(c *gin.Context) {
	response, err := callAIService("/personalities", nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI service unavailable"})
		return
	}
	
	c.JSON(http.StatusOK, response)
}

func generateWisdom(c *gin.Context) {
	theme := c.Query("theme")
	if theme == "" {
		theme = "life"
	}
	
	response, err := callAIService("/wisdom?theme="+theme, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI service unavailable"})
		return
	}
	
	c.JSON(http.StatusOK, response)
}

// 内部SNS統合エンドポイント
func getInternalFeed(c *gin.Context) {
	response, err := callSNSService("GET", "/feed", nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "SNS service unavailable"})
		return
	}
	
	c.JSON(http.StatusOK, response)
}

func createInternalPost(c *gin.Context) {
	var request map[string]interface{}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	response, err := callSNSService("POST", "/posts", request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "SNS service unavailable"})
		return
	}
	
	c.JSON(http.StatusOK, response)
}

func getTrendingTopics(c *gin.Context) {
	response, err := callSNSService("GET", "/trending", nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "SNS service unavailable"})
		return
	}
	
	c.JSON(http.StatusOK, response)
}

// Philosophy simulation with goroutines
func simulatePhilosophy(c *gin.Context) {
	philosophyType := c.Query("type")
	
	// 並列哲学的思考シミュレーション
	results := make(chan string, 5)
	
	// Go routine for different philosophical approaches
	go func() {
		results <- "🤔 論理実証主義: データから客観的真理を導出中..."
	}()
	
	go func() {
		results <- "💭 現象学: 意識の構造と体験の本質を解明中..."
	}()
	
	go func() {
		results <- "🌟 実存主義: 個人の自由と責任を探求中..."
	}()
	
	go func() {
		results <- "🏛️ 古典哲学: 永遠の智慧を現代に適用中..."
	}()
	
	go func() {
		results <- "🔬 分析哲学: 言語と論理で問題を解決中..."
	}()
	
	var responses []string
	for i := 0; i < 5; i++ {
		responses = append(responses, <-results)
	}
	
	c.JSON(http.StatusOK, gin.H{
		"philosophy_type": philosophyType,
		"parallel_thoughts": responses,
		"message": "5つの哲学的アプローチを並列実行しました",
		"goroutines_used": 5,
	})
}

// WebSocket connections for real-time features
var wsConnections = make(map[*websocket.Conn]bool)

func handleWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	wsConnections[conn] = true
	defer delete(wsConnections, conn)

	for {
		var message map[string]interface{}
		err := conn.ReadJSON(&message)
		if err != nil {
			log.Println("WebSocket read error:", err)
			break
		}

		// Handle different message types
		switch message["type"] {
		case "conviction_click":
			broadcastConvictionUpdate(0) // Trigger light effect
		case "visitor_join":
			broadcastVisitorUpdate(message)
		default:
			conn.WriteJSON(gin.H{
				"type": "echo",
				"data": message,
			})
		}
	}
}

func broadcastConvictionUpdate(count int) {
	message := gin.H{
		"type": "conviction_update",
		"count": count,
		"light_effect": count > 5,
		"timestamp": time.Now(),
	}
	
	for conn := range wsConnections {
		conn.WriteJSON(message)
	}
}

func broadcastVisitorUpdate(data interface{}) {
	message := gin.H{
		"type": "visitor_update",
		"data": data,
		"timestamp": time.Now(),
	}
	
	for conn := range wsConnections {
		conn.WriteJSON(message)
	}
}

func main() {
	// Load environment variables
	godotenv.Load()

	// Initialize database
	initDatabase()

	// Setup Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next()
	})

	// API routes
	api := r.Group("/api/v1")
	{
		// Original endpoints
		api.GET("/articles", getArticles)
		api.POST("/articles", createArticle)
		api.POST("/conviction", incrementConviction)
		api.GET("/conviction", getConvictionMeter)
		api.GET("/philosophy/simulate", simulatePhilosophy)

		// AI integration endpoints
		api.POST("/ai/chat", chatWithCharacter)
		api.POST("/ai/analyze", analyzePhilosophy)
		api.GET("/ai/personalities", getCharacterPersonalities)
		api.GET("/ai/wisdom", generateWisdom)

		// Internal SNS integration
		api.GET("/sns/feed", getInternalFeed)
		api.POST("/sns/posts", createInternalPost)
		api.GET("/sns/trending", getTrendingTopics)
	}

	// WebSocket endpoint
	r.GET("/ws", handleWebSocket)

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
			"message": "Polyglot Philosophy Playground Gateway is running!",
			"services": gin.H{
				"ai_service": AI_SERVICE_URL,
				"sns_service": SNS_SERVICE_URL,
			},
			"version": "2.0.0",
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Polyglot Philosophy Playground Gateway starting on port %s", port)
	log.Printf("🤖 AI Service: %s", AI_SERVICE_URL)
	log.Printf("📱 SNS Service: %s", SNS_SERVICE_URL)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
