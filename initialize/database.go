package initialize

import (
	"context"
	"server/global"
	"server/initialize/data"
	"server/internal/model"
	"server/internal/query"

	database "github.com/nilchaosky/databases-gorm"
	"github.com/nilchaosky/go-nexus/logz"
)

// InitDatabase 初始化数据库连接
func InitDatabase() {
	// 检查配置是否存在
	if global.Config == nil {
		panic("配置未初始化，请先初始化配置")
	}

	// 使用配置中的数据库配置初始化数据库连接
	database.Register(&global.Config.Databases)
	if database.DB == nil {
		panic("数据库连接初始化失败")
	}

	// 注册查询对象
	query.SetDefault(database.DB)

	// 自动迁移数据库表结构
	migrateDatabase()

	// 初始化数据库内容
	initDatabaseData()

	logz.Logger.Info("数据库初始化完成")
}

// migrateDatabase 自动迁移数据库表结构
func migrateDatabase() {
	if err := database.DB.AutoMigrate(
		&model.User{},
		&model.Role{},
		&model.Permission{},
		&model.RolePermission{},
	); err != nil {
		panic("数据库表迁移失败: " + err.Error())
	}
}

// initDatabaseData 初始化数据库内容
func initDatabaseData() {
	ctx := context.Background()
	if err := data.InitPermissions(ctx); err != nil {
		panic("初始化权限数据失败: " + err.Error())
	}
	if err := data.InitRoles(ctx); err != nil {
		panic("初始化角色数据失败: " + err.Error())
	}
	if err := data.InitRolePermissions(ctx); err != nil {
		panic("初始化角色权限关联失败: " + err.Error())
	}
	if err := data.InitUsers(ctx); err != nil {
		panic("初始化用户数据失败: " + err.Error())
	}
}
