package config

// Server 服务器配置
type Server struct {
	// Host 监听地址
	Host string `mapstructure:"host" json:"host" yaml:"host"`
	// Port 监听端口号
	Port string `mapstructure:"port" json:"port" yaml:"port"`
	// Env 运行环境：debug-开发模式，release-生产模式，test-测试模式
	Env string `mapstructure:"env" json:"env" yaml:"env"`
	// RoutePrefix 路由前缀，默认为空
	RoutePrefix string `mapstructure:"route_prefix" json:"route_prefix" yaml:"route_prefix"`
	// MaxConcurrency 最大并发请求数
	MaxConcurrency int `mapstructure:"max_concurrency" json:"max_concurrency" yaml:"max_concurrency"`
	// MaxContentLength 最大请求体大小（字节）
	MaxContentLength int64 `mapstructure:"max_content_length" json:"max_content_length" yaml:"max_content_length"`
	// Timeout 请求超时时间（秒）
	Timeout int `mapstructure:"timeout" json:"timeout" yaml:"timeout"`
}
