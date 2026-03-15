package initialize

import (
	"os"
	"path/filepath"
	"server/global"
	"server/internal/service"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/serialize"
	"go.uber.org/zap"
)

// InitBase 基础初始化（设置项目根路径等基础配置）
func InitBase() {
	// 初始化 Service 容器
	service.Init()
	logz.Logger.Info("Service容器初始化完成")

	root := getRootPath()
	global.SetRoot(root)
	loadWhiteList()
	logz.Logger.Info("基础初始化完成")
}

// getRootPath 获取项目根路径（查找上级目录，失败则查找当前目录）
func getRootPath() string {
	rootPath, err := filepath.Abs("..")
	if err != nil {
		rootPath, _ = filepath.Abs(".")
	}
	return rootPath
}

// loadWhiteList 读取白名单配置（使用 encoding/json 解析）
func loadWhiteList() {
	data, err := os.ReadFile("white.json")
	if err != nil {
		panic("读取白名单文件失败: " + err.Error())
	}

	var whiteList []global.WhiteListItem

	if err := serialize.JSONIter.Unmarshal(data, &whiteList); err != nil {
		panic("解析白名单文件失败: " + err.Error())
	}

	global.SetWhiteList(whiteList)
	logz.Logger.Info("白名单加载成功", zap.Int("count", len(whiteList)))
}
