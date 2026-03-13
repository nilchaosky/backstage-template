package initialize

import (
	"server/global"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/redis"
)

// InitRedis 初始化Redis连接
func InitRedis() {
	// 检查配置是否存在
	if global.Config == nil {
		panic("配置未初始化，请先初始化配置")
	}

	// 使用配置中的Redis配置
	redisConfig := global.Config.Redis

	// 注册Redis
	if err := redis.Register(redisConfig); err != nil {
		panic("Redis初始化失败: " + err.Error())
	}

	logz.Logger.Info("Redis初始化完成")
}
