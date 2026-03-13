package user

import (
	"context"
	"errors"
	"server/internal/ctxutil"
	"server/internal/types/request"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/utils/crypto"
	"go.uber.org/zap"
)

// ChangePassword 修改密码
func (s *Service) ChangePassword(ctx context.Context, req *request.ChangePasswordRequest) error {
	userID := ctxutil.GetAuthID(ctx)
	if userID.Int64() == 0 {
		logz.Logger.Warn("修改密码失败：无法获取当前用户ID")
		return errors.New("无法获取当前用户ID")
	}

	user, err := s.userRepo.GetByID(ctx, userID.Int64())
	if err != nil {
		logz.Logger.Warn("修改密码失败：查询用户失败", zap.Error(err))
		return errors.New("用户不存在")
	}
	if user == nil {
		logz.Logger.Warn("修改密码失败：用户不存在", zap.Int64("user_id", userID.Int64()))
		return errors.New("用户不存在")
	}

	if err := crypto.ComparePassword(req.OldPassword, user.Password); err != nil {
		logz.Logger.Warn("修改密码失败：旧密码错误")
		return errors.New("旧密码错误")
	}

	hashedPassword, err := crypto.HashPassword(req.NewPassword)
	if err != nil {
		logz.Logger.Error("修改密码失败：密码加密失败", zap.Error(err))
		return errors.New("密码加密失败")
	}

	user.Password = hashedPassword

	if err := s.userRepo.Update(ctx, user); err != nil {
		logz.Logger.Error("修改密码失败", zap.Error(err))
		return errors.New("修改密码失败")
	}

	s.deleteCache(ctx, userID.Int64())

	return nil
}
