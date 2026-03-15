package role

import (
	"server/internal/repository"
)

// Service 角色服务
type Service struct {
	roleRepo *repository.RoleRepository
}

// NewService 创建角色服务（依赖注入：接收 Repository）
func NewService(roleRepo *repository.RoleRepository) *Service {
	return &Service{
		roleRepo: roleRepo,
	}
}
