package initialize

import (
	"time"

	"server/global"
	"server/internal/router"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/nilchaosky/go-nexus/logz"
)

// InitRouter 初始化路由
func InitRouter() *gin.Engine {
	setGinMode()

	r := gin.New()
	r.Use(gin.Recovery())

	// 配置 CORS 中间件
	corsConfig := cors.Config{
		AllowAllOrigins: true,
		AllowMethods:    []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:    []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "origin", "Cache-Control", "X-Requested-With"},
		ExposeHeaders:   []string{"Content-Length"},
		MaxAge:          12 * time.Hour,
	}
	r.Use(cors.New(corsConfig))

	// Logger 只在 debug 模式下生效
	if gin.Mode() == gin.DebugMode {
		r.Use(gin.Logger())
	}

	// 健康检查路由
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "服务运行正常",
		})
	})

	// 注册所有业务路由
	router.NewRouter(r).RegisterRoutes()

	logz.Logger.Info("路由初始化完成")
	return r
}

// setGinMode 设置 Gin 运行模式
func setGinMode() {
	switch global.Config.Server.Env {
	case "release":
		gin.SetMode(gin.ReleaseMode)
	case "test":
		gin.SetMode(gin.TestMode)
	default:
		gin.SetMode(gin.DebugMode)
	}
}
