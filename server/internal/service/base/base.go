package base

import (
	"context"
	"errors"
	"server/global"
	"server/internal/repository"
	"server/internal/types/request"
	"server/internal/types/response"
	"time"

	nexus_enum "github.com/nilchaosky/go-nexus/enum"
	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/redis"
	"github.com/nilchaosky/go-nexus/token"
	"github.com/nilchaosky/go-nexus/utils/crypto"
	"go.uber.org/zap"
)

// Service 基础业务服务
type Service struct {
	userRepo *repository.UserRepository
}

// NewService 创建基础业务服务（依赖注入：接收 Repository）
func NewService(userRepo *repository.UserRepository) *Service {
	return &Service{
		userRepo: userRepo,
	}
}

// Login 用户登录
func (s *Service) Login(ctx context.Context, req *request.LoginRequest) (*response.LoginResponse, error) {
	// 根据用户名查询用户
	user, err := s.userRepo.GetByUsername(ctx, req.Username)
	if err != nil {
		logz.Logger.Error("用户登录失败：查询用户失败", zap.Error(err))
		return nil, errors.New("用户名或密码错误")
	}
	if user == nil {
		logz.Logger.Warn("用户登录失败：用户不存在", zap.String("username", req.Username))
		return nil, errors.New("用户名或密码错误")
	}

	// 验证密码
	if err := crypto.ComparePassword(req.Password, user.Password); err != nil {
		logz.Logger.Error("用户登录失败：密码验证失败", zap.Error(err))
		return nil, errors.New("用户名或密码错误")
	}

	// 检查用户状态（StatusDisabled = 0, StatusEnabled = 1）
	if user.Status.Value == nexus_enum.StatusDisabled {
		logz.Logger.Error("用户登录失败：用户已被禁用")
		return nil, errors.New("用户已被禁用")
	}

	// 生成 token 和 refresh token
	userIDStr := user.ID.String()
	extra := map[string]interface{}{
		"id":        userIDStr,
		"username":  user.Username,
		"role_code": "", // 这里可以根据实际业务需求设置角色代码
	}

	accessToken, refreshToken, err := token.Generate(global.Config.JWT, userIDStr, extra)
	if err != nil {
		logz.Logger.Error("用户登录失败：生成令牌失败", zap.Error(err))
		return nil, errors.New("生成令牌失败")
	}

	// 保存 token 到缓存
	duration := time.Duration(global.Config.JWT.Duration) * time.Hour
	refreshDuration := time.Duration(global.Config.JWT.RefreshDuration) * time.Hour
	if err := redis.Client.SaveToken(ctx, userIDStr, accessToken, refreshToken, duration, refreshDuration); err != nil {
		logz.Logger.Error("用户登录失败：保存令牌失败", zap.Error(err))
		return nil, errors.New("保存令牌失败")
	}
	// 返回登录响应
	return &response.LoginResponse{
		Token:        accessToken,
		RefreshToken: refreshToken,
		ID:           user.ID,
	}, nil
}

// Logout 用户退出登录
func (s *Service) Logout(ctx context.Context, userID string) error {
	// 从缓存中删除 token
	if err := redis.Client.DeleteToken(ctx, userID); err != nil {
		logz.Logger.Error("用户退出登录失败：删除令牌失败", zap.Error(err))
		return errors.New("删除令牌失败")
	}

	return nil
}
