package data

import (
	"context"
	"os"
	"server/global"
	"server/internal/dto"
	"server/internal/model"
	"server/internal/query"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/nexus_enum"
	"github.com/nilchaosky/go-nexus/serialize"
	"github.com/nilchaosky/go-nexus/serialize/variant"
	"github.com/nilchaosky/go-nexus/snowflake"
	"go.uber.org/zap"
)

// permissionItem 权限项（用于扁平化处理）
type permissionItem struct {
	Code       string
	Title      string
	ParentCode string
	API        *string
	Method     *nexus_enum.Method
}

// flattenPermissions 将层级结构的权限扁平化
func flattenPermissions(dtos []dto.PermissionDto, parentCode string) []permissionItem {
	var result []permissionItem

	for _, dto := range dtos {
		item := permissionItem{
			Code:       dto.Code,
			Title:      dto.Title,
			ParentCode: parentCode,
			API:        dto.API,
			Method:     dto.Method,
		}
		result = append(result, item)

		// 递归处理子权限
		if len(dto.Children) > 0 {
			children := flattenPermissions(dto.Children, dto.Code)
			result = append(result, children...)
		}
	}

	return result
}

// InitPermissions 初始化权限数据
// 支持项目升级时的权限同步：
// 1. 从 permission.json 读取权限定义
// 2. 新权限：自动添加
// 3. 旧权限不变：保持原样
// 4. 旧权限变更：更新（Title、API、Method、ParentID）
// 5. 旧权限删除：从 JSON 中移除的权限会被删除（如果未被角色使用）
func InitPermissions(ctx context.Context) error {
	logz.Logger.Info("开始同步权限数据")
	logz.Logger.Info(global.Root)
	// 读取 permission.json 文件
	data, err := os.ReadFile("permission.json")
	if err != nil {
		logz.Logger.Error("读取权限配置文件失败", zap.Error(err))
		return err
	}

	// 解析 JSON
	var permissionDtos []dto.PermissionDto
	if err := serialize.JSONIter.Unmarshal(data, &permissionDtos); err != nil {
		logz.Logger.Error("解析权限配置文件失败", zap.Error(err))
		return err
	}

	// 扁平化权限数据
	permissions := flattenPermissions(permissionDtos, "")

	// 开启事务处理所有权限
	return query.Q.Transaction(func(tx *query.Query) error {
		// 查询所有现有权限，按 code 建立映射
		existingPermissions, err := tx.Permission.WithContext(ctx).Find()
		if err != nil {
			logz.Logger.Error("查询现有权限失败", zap.Error(err))
			return err
		}

		existingMap := make(map[string]*model.Permission)
		for _, perm := range existingPermissions {
			existingMap[perm.Code] = perm
		}

		// 建立 code 到 ID 的映射，用于设置 ParentID
		codeToIDMap := make(map[string]int64)

		// 按层级处理权限（需要先处理父权限，再处理子权限）
		// 使用多轮处理：先处理顶级，再处理二级，最后处理三级
		// 第一轮：处理顶级权限（ParentCode 为空）
		for _, p := range permissions {
			if p.ParentCode == "" {
				existing, exists := existingMap[p.Code]
				if exists {
					// 权限已存在，检查是否需要更新
					needUpdate := false
					if existing.Title != p.Title {
						existing.Title = p.Title
						needUpdate = true
					}
					if existing.ParentID.Int64() != 0 {
						existing.ParentID = variant.SerializeInt64(0)
						needUpdate = true
					}
					if existing.API != nil {
						existing.API = nil
						needUpdate = true
					}
					if existing.Method != nil {
						existing.Method = nil
						needUpdate = true
					}

					if needUpdate {
						_, err := tx.Permission.WithContext(ctx).
							Where(tx.Permission.SnowflakeID.Eq(existing.ID.Int64())).
							Updates(existing)
						if err != nil {
							logz.Logger.Error("更新权限失败: "+p.Code, zap.Error(err))
							return err
						}
						logz.Logger.Info("权限更新成功: " + p.Code)
					} else {
						logz.Logger.Debug("权限未变更: " + p.Code)
					}

					codeToIDMap[p.Code] = existing.ID.Int64()
					// 从 map 中删除已处理的 code
					delete(existingMap, p.Code)
				} else {
					// 新权限，创建
					permission := &model.Permission{
						Code:     p.Code,
						Title:    p.Title,
						ParentID: variant.SerializeInt64(0),
						API:      nil,
						Method:   nil,
					}
					permission.ID = snowflake.GenerateSerializeInt64()

					if err := tx.Permission.WithContext(ctx).Create(permission); err != nil {
						logz.Logger.Error("创建权限失败: "+p.Code, zap.Error(err))
						return err
					}

					codeToIDMap[p.Code] = permission.ID.Int64()
					logz.Logger.Info("权限创建成功: " + p.Code)
				}
			}
		}

		// 第二轮：处理有父权限的权限（需要父权限已存在）
		// 需要多轮处理，直到所有权限都处理完成
		maxIterations := 10 // 防止无限循环
		for iteration := 0; iteration < maxIterations; iteration++ {
			processed := false
			for _, p := range permissions {
				if p.ParentCode != "" {
					// 检查父权限是否已处理
					if _, parentExists := codeToIDMap[p.ParentCode]; !parentExists {
						continue // 父权限还未处理，跳过
					}

					// 如果已经处理过，跳过（通过检查 codeToIDMap 来判断）
					if _, alreadyProcessed := codeToIDMap[p.Code]; alreadyProcessed {
						continue
					}

					processed = true

					// 从 codeToIDMap 中查找父权限ID
					parentID := codeToIDMap[p.ParentCode]

					existing, exists := existingMap[p.Code]
					if exists {
						// 权限已存在，检查是否需要更新
						needUpdate := false
						if existing.Title != p.Title {
							existing.Title = p.Title
							needUpdate = true
						}
						if existing.ParentID.Int64() != parentID {
							existing.ParentID = variant.SerializeInt64(parentID)
							needUpdate = true
						}
						if (existing.API == nil && p.API != nil) || (existing.API != nil && p.API != nil && *existing.API != *p.API) || (existing.API != nil && p.API == nil) {
							existing.API = p.API
							needUpdate = true
						}
						if (existing.Method == nil && p.Method != nil) || (existing.Method != nil && p.Method != nil && *existing.Method != *p.Method) || (existing.Method != nil && p.Method == nil) {
							existing.Method = p.Method
							needUpdate = true
						}

						if needUpdate {
							_, err := tx.Permission.WithContext(ctx).
								Where(tx.Permission.SnowflakeID.Eq(existing.ID.Int64())).
								Updates(existing)
							if err != nil {
								logz.Logger.Error("更新权限失败: "+p.Code, zap.Error(err))
								return err
							}
							logz.Logger.Info("权限更新成功: " + p.Code)
						} else {
							logz.Logger.Debug("权限未变更: " + p.Code)
						}

						codeToIDMap[p.Code] = existing.ID.Int64()
						// 从 map 中删除已处理的 code
						delete(existingMap, p.Code)
					} else {
						// 新权限，创建
						permission := &model.Permission{
							Code:     p.Code,
							Title:    p.Title,
							ParentID: variant.SerializeInt64(parentID),
							API:      p.API,
							Method:   p.Method,
						}
						permission.ID = snowflake.GenerateSerializeInt64()

						if err := tx.Permission.WithContext(ctx).Create(permission); err != nil {
							logz.Logger.Error("创建权限失败: "+p.Code, zap.Error(err))
							return err
						}

						codeToIDMap[p.Code] = permission.ID.Int64()
						logz.Logger.Info("权限创建成功: " + p.Code)
					}
				}
			}

			// 如果没有处理任何权限，说明所有权限都已处理完成
			if !processed {
				break
			}
		}

		// 检查是否有未处理的权限（可能是循环依赖或父权限不存在）
		for _, p := range permissions {
			if _, processed := codeToIDMap[p.Code]; !processed {
				logz.Logger.Warn("权限未处理，可能是父权限不存在: "+p.Code, zap.String("父权限", p.ParentCode))
			}
		}

		// 3. 处理完后检查 map 的长度，如果还有则数据库删除这个 code
		if len(existingMap) > 0 {
			for code, existing := range existingMap {
				permissionID := existing.ID.Int64()

				// 先删除 RolePermission 表中关联的权限记录
				_, err := tx.RolePermission.WithContext(ctx).
					Where(tx.RolePermission.PermissionID.Eq(permissionID)).
					Delete()
				if err != nil {
					logz.Logger.Warn("删除角色权限关联失败: "+code, zap.Error(err))
					// 继续删除权限，即使关联删除失败
				} else {
					logz.Logger.Info("角色权限关联已删除: " + code)
				}

				// 删除权限
				_, err = tx.Permission.WithContext(ctx).
					Where(tx.Permission.SnowflakeID.Eq(permissionID)).
					Delete()
				if err != nil {
					logz.Logger.Warn("删除权限失败: "+code, zap.Error(err))
					continue
				}
				logz.Logger.Info("权限已删除: " + code)
			}
		}

		logz.Logger.Info("权限数据同步完成")
		return nil
	})
}
