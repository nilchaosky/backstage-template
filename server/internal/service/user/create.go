package user

import (
	"context"
	"errors"
	"server/internal/model"
	"server/internal/types/request"

	nexus_enum "github.com/nilchaosky/go-nexus/enum"
	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/serialize/variant"
	"github.com/nilchaosky/go-nexus/snowflake"
	"github.com/nilchaosky/go-nexus/utils/crypto"
	"go.uber.org/zap"
)

// CreateUser 创建用户
func (s *Service) CreateUser(ctx context.Context, req *request.CreateUserRequest) error {
	existingUser, err := s.userRepo.GetByUsername(ctx, req.Username)
	if err != nil {
		logz.Logger.Error("创建用户失败：查询用户失败", zap.Error(err))
		return errors.New("查询用户失败")
	}
	if existingUser != nil {
		logz.Logger.Warn("创建用户失败：用户名已存在")
		return errors.New("用户名已存在")
	}

	roleID := req.RoleID.Int64()
	role, err := s.roleRepo.GetByID(ctx, roleID)
	if err != nil || role == nil {
		logz.Logger.Warn("创建用户失败：查询角色失败", zap.Int64("roleID", roleID), zap.Error(err))
		return errors.New("获取角色信息失败")
	}

	hashedPassword, err := crypto.HashPassword(req.Password)
	if err != nil {
		logz.Logger.Error("创建用户失败：密码加密失败", zap.Error(err))
		return errors.New("密码加密失败")
	}

	user := &model.User{
		Phone:    req.Phone,
		Username: req.Username,
		Password: hashedPassword,
		RoleID:   variant.SerializeInt64(roleID),
	}
	user.ID = snowflake.GenerateSerializeInt64()
	user.Status.Value = nexus_enum.StatusEnabled

	if err := s.userRepo.Create(ctx, user); err != nil {
		logz.Logger.Error("创建用户失败", zap.Error(err))
		return errors.New("创建用户失败")
	}

	return nil
}
