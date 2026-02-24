package role

import (
	"context"
	"errors"
	"server/internal/ctxutil"
	"server/internal/query"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/nexus_enum"
	"github.com/nilchaosky/go-nexus/redis"
	"go.uber.org/zap"
)

// BatchDeleteRole 批量删除角色
func (s *Service) BatchDeleteRole(ctx context.Context, redisClient *redis.Client, ids []int64) (int64, error) {
	if len(ids) == 0 {
		return 0, errors.New("角色ID列表不能为空")
	}

	validIds := make([]int64, 0, len(ids))
	for _, id := range ids {
		role, err := s.roleRepo.GetByID(ctx, id)
		if err != nil || role == nil {
			continue
		}

		if role.IsSystem == nexus_enum.FlagYes {
			continue
		}

		validIds = append(validIds, id)
	}

	if len(validIds) == 0 {
		return 0, errors.New("没有可删除的角色")
	}

	var count int64
	err := query.Q.Transaction(func(tx *query.Query) error {
		txCtx := ctxutil.WithQuery(ctx, tx)
		var err error
		count, err = s.roleRepo.BatchDelete(txCtx, validIds)
		if err != nil {
			logz.Logger.Error("批量删除角色失败", zap.Error(err))
			return errors.New("批量删除角色失败")
		}
		return nil
	})
	if err != nil {
		return 0, err
	}

	s.deleteCache(ctx, redisClient, validIds...)

	return count, nil
}
