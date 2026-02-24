package repository

import (
	"context"
	"errors"
	"server/internal/ctxutil"
	"server/internal/model"
	"strings"
	"time"

	"github.com/nilchaosky/databases-gorm"
	"github.com/nilchaosky/go-nexus/nexus_enum"
	"gorm.io/gorm"
)

// RoleRepository 角色仓储
type RoleRepository struct {
	redisDuration time.Duration
	cacheKey      string
}

// NewRoleRepository 创建角色仓储
func NewRoleRepository() *RoleRepository {
	return &RoleRepository{
		redisDuration: defaultRedisDuration,
		cacheKey:      databaseKeyPrefix + "Role:",
	}
}

// GetRedisDuration 获取Redis持续时间
func (r *RoleRepository) GetRedisDuration() time.Duration {
	return r.redisDuration
}

// SetRedisDuration 设置Redis持续时间
func (r *RoleRepository) SetRedisDuration(duration time.Duration) {
	r.redisDuration = duration
}

// GetCacheKey 获取缓存键
func (r *RoleRepository) GetCacheKey() string {
	return r.cacheKey
}

// Create 创建角色
func (r *RoleRepository) Create(ctx context.Context, role *model.Role) error {
	// 将 code 转换为大写
	role.Code = strings.ToUpper(role.Code)
	return ctxutil.GetQuery(ctx).Role.WithContext(ctx).Create(role)
}

// Count 统计角色数量
func (r *RoleRepository) Count(ctx context.Context) (int64, error) {
	return ctxutil.GetQuery(ctx).Role.WithContext(ctx).Count()
}

// GetByCode 根据角色代码获取角色
func (r *RoleRepository) GetByCode(ctx context.Context, code string) (*model.Role, error) {
	q := ctxutil.GetQuery(ctx)
	role, err := q.Role.WithContext(ctx).Where(q.Role.Code.Eq(code)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return role, nil
}

// GetByID 根据角色ID获取角色
func (r *RoleRepository) GetByID(ctx context.Context, id int64) (*model.Role, error) {
	q := ctxutil.GetQuery(ctx)
	role, err := q.Role.WithContext(ctx).Where(q.Role.SnowflakeID.Eq(id)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return role, nil
}

// GetListPage 分页获取角色列表（用于列表展示）
func (r *RoleRepository) GetListPage(ctx context.Context, page, pageSize int, title, code string, status nexus_enum.Status) ([]*model.Role, int64, error) {
	q := ctxutil.GetQuery(ctx)
	queryBuilder := q.Role.WithContext(ctx)

	// 如果指定了角色名称，添加模糊查询
	if title != "" {
		queryBuilder = queryBuilder.Where(q.Role.Title.Like(database.Like(title)))
	}

	// 如果指定了角色代码，添加模糊查询
	if code != "" {
		queryBuilder = queryBuilder.Where(q.Role.Code.Like(database.Like(code)))
	}

	// 如果指定了状态（不为0），添加状态查询
	if status != 0 {
		statusValue := status.Value()
		queryBuilder = queryBuilder.Where(q.Role.StatusValue.Eq(statusValue))
	}

	// 添加排序：先按状态升序，再按创建时间降序
	queryBuilder = queryBuilder.Order(q.Role.StatusValue.Asc(), q.Role.TimestampsCreatedAt.Desc())

	// 计算偏移量
	offset := (page - 1) * pageSize

	// 使用 FindByPage 方法进行分页查询
	return queryBuilder.FindByPage(offset, pageSize)
}

// GetSelectPage 分页获取角色列表（用于选择器）
func (r *RoleRepository) GetSelectPage(ctx context.Context, page, pageSize int, keyword string) ([]*model.Role, int64, error) {
	q := ctxutil.GetQuery(ctx)
	queryBuilder := q.Role.WithContext(ctx)

	// 默认只查询启用的角色
	statusValue := nexus_enum.StatusEnabled.Value()
	queryBuilder = queryBuilder.Where(q.Role.StatusValue.Eq(statusValue))

	// 如果提供了搜索关键词，则只搜索角色名称
	if keyword != "" {
		queryBuilder = queryBuilder.Where(q.Role.Title.Like(database.Like(keyword)))
	}

	// 添加排序：按创建时间降序
	queryBuilder = queryBuilder.Order(q.Role.TimestampsCreatedAt.Desc())

	// 计算偏移量
	offset := (page - 1) * pageSize

	// 使用 FindByPage 方法进行分页查询
	return queryBuilder.FindByPage(offset, pageSize)
}

// Delete 删除角色
func (r *RoleRepository) Delete(ctx context.Context, id int64) error {
	q := ctxutil.GetQuery(ctx)
	_, err := q.Role.WithContext(ctx).Where(q.Role.SnowflakeID.Eq(id)).Delete()
	return err
}

// BatchDelete 批量删除角色
func (r *RoleRepository) BatchDelete(ctx context.Context, ids []int64) (int64, error) {
	if len(ids) == 0 {
		return 0, nil
	}

	q := ctxutil.GetQuery(ctx)
	result, err := q.Role.WithContext(ctx).Where(q.Role.SnowflakeID.In(ids...)).Delete()
	if err != nil {
		return 0, err
	}
	return result.RowsAffected, nil
}
