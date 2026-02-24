package core

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/nilchaosky/go-nexus/logz"
	"go.uber.org/zap"
)

// Run 启动 Gin 服务器并等待系统信号优雅关闭
func Run() {
	srv := newGinServer()
	srv.start()

	waitForShutdown(srv)
}

// waitForShutdown 等待中断信号以优雅关闭服务器
func waitForShutdown(srv *ginServer) {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logz.Logger.Info("正在关闭服务器...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.shutdown(ctx); err != nil {
		logz.Logger.Fatal("服务器强制关闭", zap.Error(err))
	}

	logz.Logger.Info("服务器已退出")
}
