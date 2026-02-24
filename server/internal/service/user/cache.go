package user

import (
	"context"
	"errors"
	"server/internal/converter"
	"server/internal/ctxutil"
	"server/internal/dto"

	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/redis"
	"github.com/nilchaosky/go-nexus/serialize/variant"
	"go.uber.org/zap"
)

// getUserDtoWithCache 使用缓存获取用户DTO
func (s *Service) getUserDtoWithCache(ctx context.Context, redisClient *redis.Client, userID variant.SerializeInt64) (*dto.UserDto, error) {
	key := s.userRepo.GetCacheKey() + userID.String()
	var userDto dto.UserDto

	err := redisClient.Cache(ctx, key, &userDto, s.userRepo.GetRedisDuration(), func() (interface{}, error) {
		q := ctxutil.GetQuery(ctx)

		user, err := s.userRepo.GetByID(ctx, userID.Int64())
		if err != nil {
			logz.Logger.Error("获取用户信息失败：查询用户失败", zap.Error(err))
			return nil, errors.New("获取用户信息失败")
		}
		if user == nil {
			logz.Logger.Warn("获取用户信息失败：用户不存在", zap.String("user_id", userID.String()))
			return nil, errors.New("用户不存在")
		}

		role, err := s.roleRepo.GetByID(ctx, user.RoleID.Int64())
		if err != nil {
			logz.Logger.Warn("获取用户信息失败：查询角色失败", zap.Int64("roleID", user.RoleID.Int64()), zap.Error(err))
			return nil, errors.New("获取角色信息失败")
		}
		if role == nil {
			logz.Logger.Warn("获取用户信息失败：角色不存在", zap.Int64("roleID", user.RoleID.Int64()))
			return nil, errors.New("获取角色信息失败")
		}

		userDto := converter.ToUserDto(user)

		// 设置角色编码
		userDto.RoleCode = role.Code

		// 查询角色关联的权限
		rolePermissions, err := q.RolePermission.WithContext(ctx).
			Where(q.RolePermission.RoleID.Eq(role.ID.Int64())).
			Find()
		if err != nil {
			logz.Logger.Error("获取用户信息失败：查询角色权限失败", zap.Error(err))
			return nil, errors.New("获取角色权限失败")
		}

		if len(rolePermissions) > 0 {
			// 收集权限 ID
			permissionIDs := make([]int64, 0, len(rolePermissions))
			for _, rp := range rolePermissions {
				if rp == nil {
					continue
				}
				permissionIDs = append(permissionIDs, rp.PermissionID.Int64())
			}

			if len(permissionIDs) > 0 {
				// 查询权限详情
				permissions, err := q.Permission.WithContext(ctx).
					Where(q.Permission.SnowflakeID.In(permissionIDs...)).
					Find()
				if err != nil {
					logz.Logger.Error("获取用户信息失败：查询权限详情失败", zap.Error(err))
					return nil, errors.New("获取权限信息失败")
				}

				userDto.Permission = make([]string, 0, len(permissions))
				userDto.UriList = make([]dto.Uri, 0, len(permissions))

				for _, p := range permissions {
					if p == nil {
						continue
					}

					// 收集权限代码
					if p.Code != "" {
						userDto.Permission = append(userDto.Permission, p.Code)
					}

					// 收集 API 路径和方法（仅当有值时）
					if p.API != nil && *p.API != "" && p.Method != nil {
						userDto.UriList = append(userDto.UriList, dto.Uri{
							Route:  *p.API,
							Method: string(*p.Method),
						})
					}
				}
			}
		}

		return userDto, nil
	})

	if err != nil {
		return nil, err
	}

	return &userDto, nil
}

// deleteCache 删除用户缓存
func (s *Service) deleteCache(ctx context.Context, redisClient *redis.Client, ids ...int64) {
	if len(ids) == 0 {
		return
	}

	keys := make([]string, 0, len(ids))
	for _, id := range ids {
		key := s.userRepo.GetCacheKey() + variant.SerializeInt64(id).String()
		keys = append(keys, key)
	}

	_, err := redisClient.Del(ctx, keys...)
	if err != nil {
		logz.Logger.Warn("删除用户缓存失败", zap.Error(err))
	}
}
