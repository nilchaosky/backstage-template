package role

import (
	"context"
	"errors"
	"server/internal/dto"

	"github.com/nilchaosky/go-nexus/logz"
	nexus_types "github.com/nilchaosky/go-nexus/types"
	"go.uber.org/zap"
)

// GetRoleSelectPage 分页获取角色选择器列表
func (s *Service) GetRoleSelectPage(ctx context.Context, current, size int, keyword string) (*nexus_types.Page[dto.RoleDto], error) {
	roles, total, err := s.roleRepo.GetSelectPage(ctx, current, size, keyword)
	if err != nil {
		logz.Logger.Error("获取角色选择器列表失败", zap.Error(err))
		return nil, errors.New("获取角色选择器列表失败")
	}

	records := make([]*dto.RoleDto, 0, len(roles))
	for _, role := range roles {
		roleDto, err := s.getRoleDtoWithCache(ctx, role.ID)
		if err != nil {
			logz.Logger.Warn("获取角色DTO失败", zap.Error(err), zap.Int64("role_id", role.ID.Int64()))
			continue
		}
		records = append(records, roleDto)
	}

	hasMore := int64(current*size) < total

	return &nexus_types.Page[dto.RoleDto]{
		Current: current,
		Size:    size,
		Total:   total,
		Records: records,
		HasMore: hasMore,
	}, nil
}
