package role

import (
	"context"
	"errors"
	"server/internal/dto"
	"server/internal/types/request"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/nexus_enum"
	"github.com/nilchaosky/go-nexus/nexusres_types"
	"github.com/nilchaosky/go-nexus/redis"
	"go.uber.org/zap"
)

// GetRoleListPage 分页获取角色列表
func (s *Service) GetRoleListPage(ctx context.Context, redisClient *redis.Client, current, size int, input *request.RoleListPageInput) (*nexusres_types.Page[dto.RoleDto], error) {
	var title, code string
	var status nexus_enum.Status
	if input != nil {
		title = input.Title
		code = input.Code
		status = input.Status
	}

	roles, total, err := s.roleRepo.GetListPage(ctx, current, size, title, code, status)
	if err != nil {
		logz.Logger.Error("获取角色列表失败", zap.Error(err))
		return nil, errors.New("获取角色列表失败")
	}

	records := make([]*dto.RoleDto, 0, len(roles))
	for _, role := range roles {
		roleDto, err := s.getRoleDtoWithCache(ctx, redisClient, role.ID)
		if err != nil {
			logz.Logger.Warn("获取角色DTO失败", zap.Error(err), zap.Int64("role_id", role.ID.Int64()))
			continue
		}
		records = append(records, roleDto)
	}

	hasMore := int64(current*size) < total

	return &nexusres_types.Page[dto.RoleDto]{
		Current: current,
		Size:    size,
		Total:   total,
		Records: records,
		HasMore: hasMore,
	}, nil
}
