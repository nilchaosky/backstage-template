package role

import (
	"context"
	"errors"
	"server/internal/model"
	"server/internal/types/request"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/nexus_enum"
	"github.com/nilchaosky/go-nexus/redis"
	"github.com/nilchaosky/go-nexus/snowflake"
	"go.uber.org/zap"
)

// CreateRole 创建角色
func (s *Service) CreateRole(ctx context.Context, redisClient *redis.Client, req *request.CreateRoleRequest) error {
	existingRole, err := s.roleRepo.GetByCode(ctx, req.Code)
	if err != nil {
		logz.Logger.Error("创建角色失败：查询角色失败", zap.Error(err))
		return errors.New("查询角色失败")
	}
	if existingRole != nil {
		logz.Logger.Warn("创建角色失败：角色代码已存在")
		return errors.New("角色代码已存在")
	}

	role := &model.Role{
		Title:    req.Title,
		Code:     req.Code,
		IsSystem: nexus_enum.FlagNo,
	}
	role.ID = snowflake.GenerateSerializeInt64()
	role.Status.Value = nexus_enum.StatusEnabled

	if err := s.roleRepo.Create(ctx, role); err != nil {
		logz.Logger.Error("创建角色失败", zap.Error(err))
		return errors.New("创建角色失败")
	}

	return nil
}
