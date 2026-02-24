package repository

import (
	"context"
	"errors"
	"server/internal/ctxutil"
	"server/internal/model"
	"time"

	"github.com/nilchaosky/databases-gorm"
	"github.com/nilchaosky/go-nexus/nexus_enum"
	"gorm.io/gorm"
)

// UserRepository 用户仓储
type UserRepository struct {
	redisDuration time.Duration
	cacheKey      string
}

// NewUserRepository 创建用户仓储
func NewUserRepository() *UserRepository {
	return &UserRepository{
		redisDuration: defaultRedisDuration,
		cacheKey:      databaseKeyPrefix + "User:",
	}
}

// GetRedisDuration 获取Redis持续时间
func (r *UserRepository) GetRedisDuration() time.Duration {
	return r.redisDuration
}

// SetRedisDuration 设置Redis持续时间
func (r *UserRepository) SetRedisDuration(duration time.Duration) {
	r.redisDuration = duration
}

// GetCacheKey 获取缓存键
func (r *UserRepository) GetCacheKey() string {
	return r.cacheKey
}

// Create 创建用户
func (r *UserRepository) Create(ctx context.Context, user *model.User) error {
	return ctxutil.GetQuery(ctx).User.WithContext(ctx).Create(user)
}

// Update 更新用户
func (r *UserRepository) Update(ctx context.Context, user *model.User) error {
	q := ctxutil.GetQuery(ctx)
	_, err := q.User.WithContext(ctx).Where(q.User.SnowflakeID.Eq(user.ID.Int64())).Updates(user)
	return err
}

// Count 统计用户数量
func (r *UserRepository) Count(ctx context.Context) (int64, error) {
	return ctxutil.GetQuery(ctx).User.WithContext(ctx).Count()
}

// GetByUsername 根据用户名获取用户
func (r *UserRepository) GetByUsername(ctx context.Context, username string) (*model.User, error) {
	q := ctxutil.GetQuery(ctx)
	user, err := q.User.WithContext(ctx).Where(q.User.Username.Eq(username)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return user, nil
}

// GetByID 根据ID获取用户
func (r *UserRepository) GetByID(ctx context.Context, id int64) (*model.User, error) {
	q := ctxutil.GetQuery(ctx)
	user, err := q.User.WithContext(ctx).Where(q.User.SnowflakeID.Eq(id)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return user, nil
}

// GetListPage 分页获取用户列表（用于列表展示）
func (r *UserRepository) GetListPage(ctx context.Context, page, pageSize int, username string, status nexus_enum.Status) ([]*model.User, int64, error) {
	q := ctxutil.GetQuery(ctx)
	queryBuilder := q.User.WithContext(ctx)

	// 如果指定了用户名，添加模糊查询
	if username != "" {
		queryBuilder = queryBuilder.Where(q.User.Username.Like(database.Like(username)))
	}

	// 如果指定了状态（不为0），添加状态查询
	if status != 0 {
		statusValue := status.Value()
		queryBuilder = queryBuilder.Where(q.User.StatusValue.Eq(statusValue))
	}

	// 添加排序：先按状态升序，再按创建时间降序
	queryBuilder = queryBuilder.Order(q.User.StatusValue.Asc(), q.User.TimestampsCreatedAt.Desc())

	// 计算偏移量
	offset := (page - 1) * pageSize

	// 使用 FindByPage 方法进行分页查询
	return queryBuilder.FindByPage(offset, pageSize)
}

// Delete 删除用户
func (r *UserRepository) Delete(ctx context.Context, id int64) error {
	q := ctxutil.GetQuery(ctx)
	_, err := q.User.WithContext(ctx).Where(q.User.SnowflakeID.Eq(id)).Delete()
	return err
}

// BatchDelete 批量删除用户
func (r *UserRepository) BatchDelete(ctx context.Context, ids []int64) (int64, error) {
	if len(ids) == 0 {
		return 0, nil
	}

	q := ctxutil.GetQuery(ctx)
	result, err := q.User.WithContext(ctx).Where(q.User.SnowflakeID.In(ids...)).Delete()
	if err != nil {
		return 0, err
	}
	return result.RowsAffected, nil
}
