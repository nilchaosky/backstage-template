package role

import (
	"context"
	"errors"
	"server/internal/converter"
	"server/internal/dto"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/redis"
	"github.com/nilchaosky/go-nexus/serialize/variant"
	"go.uber.org/zap"
)

// getRoleDtoWithCache 使用缓存获取角色DTO
func (s *Service) getRoleDtoWithCache(ctx context.Context, roleID variant.SerializeInt64) (*dto.RoleDto, error) {
	key := s.roleRepo.GetCacheKey() + roleID.String()
	var roleDto dto.RoleDto

	err := redis.Client.Cache(ctx, key, &roleDto, s.roleRepo.GetRedisDuration(), func() (interface{}, error) {
		role, err := s.roleRepo.GetByID(ctx, roleID.Int64())
		if err != nil {
			logz.Logger.Error("获取角色信息失败：查询角色失败", zap.Error(err))
			return nil, errors.New("获取角色信息失败")
		}
		if role == nil {
			logz.Logger.Warn("获取角色信息失败：角色不存在", zap.String("role_id", roleID.String()))
			return nil, errors.New("角色不存在")
		}

		roleDto := converter.ToRoleDto(role)
		return roleDto, nil
	})

	if err != nil {
		return nil, err
	}

	return &roleDto, nil
}

// deleteCache 删除角色缓存
func (s *Service) deleteCache(ctx context.Context, ids ...int64) {
	if len(ids) == 0 {
		return
	}

	keys := make([]string, 0, len(ids))
	for _, id := range ids {
		key := s.roleRepo.GetCacheKey() + variant.SerializeInt64(id).String()
		keys = append(keys, key)
	}

	_, err := redis.Client.Del(ctx, keys...)
	if err != nil {
		logz.Logger.Warn("删除角色缓存失败", zap.Error(err))
	}
}
