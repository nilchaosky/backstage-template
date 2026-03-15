package core

import (
	"context"
	"net/http"
	"os"
	"server/global"
	"server/initialize"
	"time"

	"github.com/nilchaosky/go-nexus/logz"
	"go.uber.org/zap"
)

// ginServer Gin 服务器
type ginServer struct {
	httpServer *http.Server
}

// newGinServer 创建 Gin 服务器实例
func newGinServer() *ginServer {
	engine := initialize.InitRouter()

	// 获取服务器配置，如果为空则使用默认值
	serverConfig := global.Config.Server

	maxConcurrency := serverConfig.MaxConcurrency
	if maxConcurrency == 0 {
		maxConcurrency = 1000
	}

	maxContentLength := serverConfig.MaxContentLength
	if maxContentLength == 0 {
		maxContentLength = 10 * 1024 * 1024 // 10MB
	}

	timeout := serverConfig.Timeout
	if timeout == 0 {
		timeout = 30
	}

	host := serverConfig.Host
	if host == "" {
		host = "0.0.0.0"
	}
	port := serverConfig.Port
	if port == "" {
		port = "8080"
	}
	addr := host + ":" + port
	httpServer := &http.Server{
		Addr:           addr,
		Handler:        engine,
		ReadTimeout:    time.Duration(timeout) * time.Second,
		WriteTimeout:   time.Duration(timeout) * time.Second,
		MaxHeaderBytes: int(maxContentLength),
	}

	return &ginServer{
		httpServer: httpServer,
	}
}

// start 启动服务器（在 goroutine 中启动，错误直接退出）
func (s *ginServer) start() {
	logz.Logger.Info("服务器启动", zap.String("addr", s.httpServer.Addr))
	go func() {
		if err := s.httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logz.Logger.Error("服务器启动失败", zap.Error(err))
			os.Exit(1)
		}
	}()
}

// shutdown 优雅关闭服务器
func (s *ginServer) shutdown(ctx context.Context) error {
	return s.httpServer.Shutdown(ctx)
}
