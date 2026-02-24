package initialize

import (
	"server/global"

	"github.com/nilchaosky/file-store/oss"
	"github.com/nilchaosky/go-nexus/logz"
	"go.uber.org/zap"
)

// InitFile 初始化文件存储
func InitFile() {
	// 检查配置是否存在
	if global.Config == nil {
		panic("配置未初始化，请先初始化配置")
	}

	// 初始化OSS配置
	initOSS()
}

// initOSS 初始化OSS配置
func initOSS() {
	// 使用配置中的OSS配置
	ossConfig := global.Config.OSS

	// 验证配置是否有效（如果配置为空，跳过初始化）
	if err := ossConfig.Validate(); err != nil {
		logz.Logger.Warn("OSS配置无效，跳过OSS初始化", zap.Error(err))
		return
	}

	// 注册OSS客户端（使用默认key "default"）
	if err := oss.Register(ossConfig, "default"); err != nil {
		panic("OSS初始化失败: " + err.Error())
	}

	logz.Logger.Info("OSS初始化完成")
}
