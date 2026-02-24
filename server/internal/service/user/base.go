package user

import (
	"server/internal/repository"
)

// Service 用户服务
type Service struct {
	userRepo *repository.UserRepository
	roleRepo *repository.RoleRepository
}

// NewService 创建用户服务（依赖注入：接收 Repository）
func NewService(userRepo *repository.UserRepository, roleRepo *repository.RoleRepository) *Service {
	return &Service{
		userRepo: userRepo,
		roleRepo: roleRepo,
	}
}
