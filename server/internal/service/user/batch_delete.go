package user

import (
	"context"
	"errors"
	"server/internal/ctxutil"
	"server/internal/query"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/redis"
	"go.uber.org/zap"
)

// BatchDeleteUser 批量删除用户
func (s *Service) BatchDeleteUser(ctx context.Context, redisClient *redis.Client, ids []int64) (int64, error) {
	if len(ids) == 0 {
		return 0, errors.New("用户ID列表不能为空")
	}

	validIds := make([]int64, 0, len(ids))
	for _, id := range ids {
		user, err := s.userRepo.GetByID(ctx, id)
		if err != nil || user == nil {
			continue
		}
		validIds = append(validIds, id)
	}

	if len(validIds) == 0 {
		return 0, errors.New("没有可删除的用户")
	}

	var count int64
	err := query.Q.Transaction(func(tx *query.Query) error {
		txCtx := ctxutil.WithQuery(ctx, tx)
		var err error
		count, err = s.userRepo.BatchDelete(txCtx, validIds)
		if err != nil {
			logz.Logger.Error("批量删除用户失败", zap.Error(err))
			return errors.New("批量删除用户失败")
		}
		return nil
	})
	if err != nil {
		return 0, err
	}

	s.deleteCache(ctx, redisClient, validIds...)

	return count, nil
}
