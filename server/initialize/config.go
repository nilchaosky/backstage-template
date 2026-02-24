package initialize

import (
	"server/config"
	"server/global"

	"github.com/nilchaosky/go-nexus/viper"
)

// InitConfig 初始化配置（从 YAML 文件加载配置并设置为全局配置）
func InitConfig() {
	cfg := &config.Config{}

	if err := viper.Register[config.Config]("config.yaml", cfg); err != nil {
		panic("读取配置文件失败: " + err.Error())
	}

	// 设置为全局配置
	global.SetConfig(cfg)
}
