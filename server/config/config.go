package config

import (
	database "github.com/nilchaosky/databases-gorm"
	"github.com/nilchaosky/file-store/oss"
	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/redis"
	"github.com/nilchaosky/go-nexus/redis/token"
)

// Config 应用配置
type Config struct {
	// Server 服务器配置
	Server Server `mapstructure:"server" json:"server" yaml:"server"`
	// Log 日志配置
	Log logz.Config `mapstructure:"log" json:"log" yaml:"log"`
	// Redis Redis配置
	Redis redis.Config `mapstructure:"redis" json:"redis" yaml:"redis"`
	// JWT JWT配置
	JWT token.Config `mapstructure:"jwt" json:"jwt" yaml:"jwt"`
	// Databases 数据库配置
	Databases database.Config `mapstructure:"databases" json:"databases" yaml:"databases"`
	// OSS OSS配置
	OSS oss.Config `mapstructure:"oss" json:"oss" yaml:"oss"`
}
