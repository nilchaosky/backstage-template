package service

import (
	"sync"

	"server/internal/repository"
	"server/internal/service/base"
	"server/internal/service/role"
	"server/internal/service/user"
)

// Container 服务容器，统一管理所有 Service 实例
type Container struct {
	// 使用 sync.Once 确保只初始化一次
	initOnce sync.Once

	// Repository 实例（无状态，可以共享）
	userRepo *repository.UserRepository
	roleRepo *repository.RoleRepository

	// Service 实例（无状态，不包含 redisClient）
	baseService *base.Service
	userService *user.Service
	roleService *role.Service
}

// 全局服务容器实例
var container = &Container{}

// Init 初始化服务容器（依赖注入：创建 Repository 和 Service）
func Init() {
	container.initOnce.Do(func() {
		// 创建 Repository 实例（无状态，可以共享）
		container.userRepo = repository.NewUserRepository()
		container.roleRepo = repository.NewRoleRepository()

		// 创建 Service 实例（通过构造函数注入 Repository）
		container.baseService = base.NewService(container.userRepo)
		container.userService = user.NewService(container.userRepo, container.roleRepo)
		container.roleService = role.NewService(container.roleRepo)
	})
}

// Base 获取基础服务（redisClient 作为方法参数传入）
func (c *Container) Base() *base.Service {
	return c.baseService
}

// User 获取用户服务（redisClient 作为方法参数传入）
func (c *Container) User() *user.Service {
	return c.userService
}

// Role 获取角色服务（redisClient 作为方法参数传入）
func (c *Container) Role() *role.Service {
	return c.roleService
}

// Get 获取服务容器实例（提供便捷访问）
func Get() *Container {
	return container
}
