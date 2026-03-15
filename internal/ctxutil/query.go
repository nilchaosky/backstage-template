package ctxutil

import (
	"context"
	"server/internal/query"
)

type queryKey struct{}

// WithQuery 将查询对象放入 context
func WithQuery(ctx context.Context, q *query.Query) context.Context {
	return context.WithValue(ctx, queryKey{}, q)
}

// GetQuery 从 context 中获取查询对象，如果没有则返回默认查询对象
func GetQuery(ctx context.Context) *query.Query {
	if q, ok := ctx.Value(queryKey{}).(*query.Query); ok && q != nil {
		return q
	}
	return query.Q
}
