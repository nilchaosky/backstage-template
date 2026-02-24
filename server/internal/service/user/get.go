package user

import (
	"context"
	"server/internal/dto"

	"github.com/nilchaosky/go-nexus/redis"
	"github.com/nilchaosky/go-nexus/serialize/variant"
)

// GetUserByID 根据ID获取用户
func (s *Service) GetUserByID(ctx context.Context, redisClient *redis.Client, userID variant.SerializeInt64) (*dto.UserDto, error) {
	return s.getUserDtoWithCache(ctx, redisClient, userID)
}
