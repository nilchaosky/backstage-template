package data

import (
	"context"
	"errors"
	"server/internal/model"
	"server/internal/query"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/nexus_enum"
	"github.com/nilchaosky/go-nexus/nexus_utils/crypto"
	"github.com/nilchaosky/go-nexus/snowflake"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

// InitUsers 初始化用户数据
func InitUsers(ctx context.Context) error {
	// 判断用户表是否为空
	count, err := query.Q.User.WithContext(ctx).Count()
	if err != nil {
		logz.Logger.Error("查询用户表数量失败", zap.Error(err))
		return err
	}

	// 如果用户表为空，初始化基础数据
	if count == 0 {
		logz.Logger.Info("用户表为空，开始初始化用户数据")

		// 获取Admin角色
		adminRole, err := query.Q.Role.WithContext(ctx).Where(query.Q.Role.Code.Eq("ADMIN")).First()
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				logz.Logger.Error("Admin角色不存在，无法创建Admin用户")
				return errors.New("Admin角色不存在")
			}
			logz.Logger.Error("查询Admin角色失败", zap.Error(err))
			return err
		}
		if adminRole == nil {
			logz.Logger.Error("Admin角色不存在，无法创建Admin用户")
			return errors.New("Admin角色不存在")
		}

		// 加密密码
		hashedPassword, err := crypto.HashPassword("123456")
		if err != nil {
			logz.Logger.Error("密码加密失败", zap.Error(err))
			return err
		}

		// 创建Admin用户
		user := &model.User{
			Phone:    "18000000000",
			Username: "admin",
			Password: hashedPassword,
			RoleID:   adminRole.ID,
		}
		user.ID = snowflake.GenerateSerializeInt64()
		user.Status.Value = nexus_enum.StatusEnabled

		// 直接使用 query 创建用户
		if err := query.Q.User.WithContext(ctx).Create(user); err != nil {
			logz.Logger.Error("创建Admin用户失败", zap.Error(err))
			return err
		}

		logz.Logger.Info("Admin用户创建成功")
	}

	return nil
}
