package global

import (
	"server/config"
)

// WhiteListItem 白名单项
type WhiteListItem struct {
	Route  string `json:"route"`
	Method string `json:"method"`
}

var (
	// Config 全局配置
	Config *config.Config
	// Root 项目根路径
	Root string
	// WhiteList 白名单列表
	WhiteList []WhiteListItem
)

// SetConfig 设置全局配置
func SetConfig(cfg *config.Config) {
	Config = cfg
}

// SetRoot 设置项目根路径
func SetRoot(root string) {
	Root = root
}

// SetWhiteList 设置白名单
func SetWhiteList(whiteList []WhiteListItem) {
	WhiteList = whiteList
}
