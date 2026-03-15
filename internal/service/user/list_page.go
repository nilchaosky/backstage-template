package user

import (
	"context"
	"errors"
	"server/internal/dto"
	"server/internal/types/request"

	nexus_enum "github.com/nilchaosky/go-nexus/enum"
	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/serialize/variant"
	nexus_types "github.com/nilchaosky/go-nexus/types"
	"go.uber.org/zap"
)

// GetUserListPage 分页获取用户列表
func (s *Service) GetUserListPage(ctx context.Context, current, size int, input *request.UserListPageInput) (*nexus_types.Page[dto.UserDto], error) {
	var username string
	var status nexus_enum.Status
	if input != nil {
		username = input.Username
		status = input.Status
	}

	users, total, err := s.userRepo.GetListPage(ctx, current, size, username, status)
	if err != nil {
		logz.Logger.Error("获取用户列表失败：查询失败", zap.Error(err))
		return nil, errors.New("获取用户列表失败")
	}

	records := make([]*dto.UserDto, 0, len(users))
	for _, user := range users {
		userDto, err := s.getUserDtoWithCache(ctx, variant.SerializeInt64(user.ID.Int64()))
		if err != nil {
			logz.Logger.Warn("获取用户DTO失败", zap.Error(err), zap.Int64("user_id", user.ID.Int64()))
			continue
		}
		records = append(records, userDto)
	}

	hasMore := int64(current*size) < total

	return &nexus_types.Page[dto.UserDto]{
		Current: current,
		Size:    size,
		Total:   total,
		Records: records,
		HasMore: hasMore,
	}, nil
}
