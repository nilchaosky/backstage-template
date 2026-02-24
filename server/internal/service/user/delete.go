package user

import (
	"context"
	"errors"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/redis"
	"go.uber.org/zap"
)

// DeleteUser 删除用户
func (s *Service) DeleteUser(ctx context.Context, redisClient *redis.Client, id int64) error {
	user, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		logz.Logger.Warn("删除用户失败：查询用户失败", zap.Error(err))
		return errors.New("用户不存在")
	}
	if user == nil {
		logz.Logger.Warn("删除用户失败：用户不存在", zap.Int64("user_id", id))
		return errors.New("用户不存在")
	}

	if err := s.userRepo.Delete(ctx, id); err != nil {
		logz.Logger.Error("删除用户失败", zap.Error(err))
		return errors.New("删除用户失败")
	}

	s.deleteCache(ctx, redisClient, id)

	return nil
}
