package role

import (
	"context"
	"errors"

	nexus_enum "github.com/nilchaosky/go-nexus/enum"
	"github.com/nilchaosky/go-nexus/logz"
	"go.uber.org/zap"
)

// DeleteRole 删除角色
func (s *Service) DeleteRole(ctx context.Context, id int64) error {
	role, err := s.roleRepo.GetByID(ctx, id)
	if err != nil {
		logz.Logger.Warn("删除角色失败：查询角色失败", zap.Error(err))
		return errors.New("角色不存在")
	}
	if role == nil {
		logz.Logger.Warn("删除角色失败：角色不存在", zap.Int64("role_id", id))
		return errors.New("角色不存在")
	}

	if role.IsSystem == nexus_enum.FlagYes {
		logz.Logger.Warn("删除角色失败：系统角色不能删除")
		return errors.New("系统角色不能删除")
	}

	if err := s.roleRepo.Delete(ctx, id); err != nil {
		logz.Logger.Error("删除角色失败", zap.Error(err))
		return errors.New("删除角色失败")
	}

	s.deleteCache(ctx, id)

	return nil
}
