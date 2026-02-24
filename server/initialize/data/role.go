package data

import (
	"context"
	"errors"
	"server/internal/model"
	"server/internal/query"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/nexus_enum"
	"github.com/nilchaosky/go-nexus/snowflake"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

// roles 角色模板列表（用于初始化）
var roles []*model.Role

// init 初始化角色列表数据
func init() {
	roles = []*model.Role{
		{
			Title:    "管理员",
			Code:     "ADMIN",
			IsSystem: nexus_enum.FlagYes,
		},
	}
}

// InitRoles 初始化角色数据
func InitRoles(ctx context.Context) error {
	// 开启事务处理所有角色
	return query.Q.Transaction(func(tx *query.Query) error {
		// 遍历 init 函数中定义的角色列表
		for _, r := range roles {
			// 查询角色是否已存在
			existingRole, err := tx.Role.WithContext(ctx).Where(tx.Role.Code.Eq(r.Code)).First()
			if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
				logz.Logger.Error("查询角色失败: "+r.Code, zap.Error(err))
				return err
			}

			// 如果角色已存在，跳过
			if existingRole != nil {
				continue
			}

			// 角色不存在，创建新角色
			role := &model.Role{
				Title:    r.Title,
				Code:     r.Code,
				IsSystem: r.IsSystem,
			}
			role.ID = snowflake.GenerateSerializeInt64()
			role.Status.Value = nexus_enum.StatusEnabled

			if err := tx.Role.WithContext(ctx).Create(role); err != nil {
				logz.Logger.Error("创建角色失败: "+r.Code, zap.Error(err))
				return err
			}

			logz.Logger.Info("角色创建成功: " + r.Code)
		}

		return nil
	})
}
