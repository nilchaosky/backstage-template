package role

import (
	"context"
	"server/internal/dto"

	"github.com/nilchaosky/go-nexus/redis"
	"github.com/nilchaosky/go-nexus/serialize/variant"
)

// GetRoleByID 根据ID获取角色
func (s *Service) GetRoleByID(ctx context.Context, redisClient *redis.Client, roleID int64) (*dto.RoleDto, error) {
	return s.getRoleDtoWithCache(ctx, redisClient, variant.SerializeInt64(roleID))
}
