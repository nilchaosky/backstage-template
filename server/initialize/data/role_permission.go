package data

import (
	"context"
	"errors"
	"server/internal/model"
	"server/internal/query"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/serialize/variant"
	"github.com/nilchaosky/go-nexus/snowflake"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

// InitRolePermissions 初始化角色权限关联数据
func InitRolePermissions(ctx context.Context) error {
	// 获取 ADMIN 角色
	adminRole, err := query.Q.Role.WithContext(ctx).Where(query.Q.Role.Code.Eq("ADMIN")).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logz.Logger.Warn("ADMIN角色不存在，跳过角色权限关联初始化")
			return nil
		}
		logz.Logger.Error("查询ADMIN角色失败", zap.Error(err))
		return err
	}
	if adminRole == nil {
		logz.Logger.Warn("ADMIN角色不存在，跳过角色权限关联初始化")
		return nil
	}

	logz.Logger.Info("开始同步ADMIN角色权限关联")

	// 获取所有权限
	permissions, err := query.Q.Permission.WithContext(ctx).Find()
	if err != nil {
		logz.Logger.Error("查询所有权限失败", zap.Error(err))
		return err
	}

	if len(permissions) == 0 {
		logz.Logger.Warn("权限表为空，跳过角色权限关联同步")
		return nil
	}

	// 开启事务处理所有关联
	return query.Q.Transaction(func(tx *query.Query) error {
		roleID := adminRole.ID.Int64()

		// 查询现有的关联
		existingRolePermissions, err := tx.RolePermission.WithContext(ctx).
			Where(tx.RolePermission.RoleID.Eq(roleID)).
			Find()
		if err != nil {
			logz.Logger.Error("查询现有角色权限关联失败", zap.Error(err))
			return err
		}

		// 建立权限ID到关联的映射
		existingMap := make(map[int64]*model.RolePermission)
		for _, rp := range existingRolePermissions {
			existingMap[rp.PermissionID.Int64()] = rp
		}

		// 为每个权限创建或检查关联
		for _, permission := range permissions {
			permissionID := permission.ID.Int64()

			// 检查关联是否已存在
			if _, exists := existingMap[permissionID]; exists {
				continue
			}

			// 创建新关联
			rolePermission := &model.RolePermission{
				RoleID:       variant.SerializeInt64(roleID),
				PermissionID: variant.SerializeInt64(permissionID),
			}
			rolePermission.ID = snowflake.GenerateSerializeInt64()

			if err := tx.RolePermission.WithContext(ctx).Create(rolePermission); err != nil {
				logz.Logger.Error("创建角色权限关联失败", zap.Error(err))
				return err
			}
		}

		logz.Logger.Info("ADMIN角色权限关联同步完成")
		return nil
	})
}
