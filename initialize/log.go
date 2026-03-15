package initialize

import (
	"server/global"

	"github.com/nilchaosky/go-nexus/logz"
)

// InitLog 初始化日志
func InitLog() {
	// 检查配置是否存在
	if global.Config == nil {
		panic("配置未初始化，请先初始化配置")
	}

	// 使用配置中的日志配置
	logConfig := global.Config.Log

	// 注册日志
	if err := logz.Register(logConfig); err != nil {
		panic("日志初始化失败: " + err.Error())
	}

	logz.Logger.Info("日志初始化完成")
}
