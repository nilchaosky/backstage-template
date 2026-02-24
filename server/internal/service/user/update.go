package user

import (
	"context"
	"errors"
	"server/internal/types/request"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/redis"
	"go.uber.org/zap"
)

// UpdateUser 更新用户
func (s *Service) UpdateUser(ctx context.Context, redisClient *redis.Client, req *request.UpdateUserRequest) error {
	user, err := s.userRepo.GetByID(ctx, req.ID.Int64())
	if err != nil {
		logz.Logger.Warn("更新用户失败：查询用户失败", zap.Error(err))
		return errors.New("用户不存在")
	}
	if user == nil {
		logz.Logger.Warn("更新用户失败：用户不存在", zap.Int64("user_id", req.ID.Int64()))
		return errors.New("用户不存在")
	}

	if user.Username != req.Username {
		existingUser, err := s.userRepo.GetByUsername(ctx, req.Username)
		if err != nil {
			logz.Logger.Error("更新用户失败：查询用户失败", zap.Error(err))
			return errors.New("查询用户失败")
		}
		if existingUser != nil {
			logz.Logger.Warn("更新用户失败：用户名已存在")
			return errors.New("用户名已存在")
		}
	}

	roleID := req.RoleID.Int64()
	role, err := s.roleRepo.GetByID(ctx, roleID)
	if err != nil || role == nil {
		logz.Logger.Warn("更新用户失败：查询角色失败", zap.Int64("roleID", roleID), zap.Error(err))
		return errors.New("获取角色信息失败")
	}

	user.Phone = req.Phone
	user.Username = req.Username
	user.RoleID = req.RoleID

	if err := s.userRepo.Update(ctx, user); err != nil {
		logz.Logger.Error("更新用户失败", zap.Error(err))
		return errors.New("更新用户失败")
	}

	s.deleteCache(ctx, redisClient, req.ID.Int64())

	return nil
}
