package ctxutil

import (
	"context"
	"github.com/nilchaosky/go-nexus/serialize/variant"
)

type authKey struct{}

// AuthInfo 认证信息
type AuthInfo struct {
	ID       variant.SerializeInt64
	Username string
	RoleCode string
}

// WithAuth 将认证信息放入 context
func WithAuth(ctx context.Context, authInfo *AuthInfo) context.Context {
	return context.WithValue(ctx, authKey{}, authInfo)
}

// GetAuth 从 context 中获取认证信息
func GetAuth(ctx context.Context) *AuthInfo {
	authInfo, ok := ctx.Value(authKey{}).(*AuthInfo)
	if !ok || authInfo == nil {
		return nil
	}
	return authInfo
}

// GetAuthID 从 context 中获取用户ID
func GetAuthID(ctx context.Context) variant.SerializeInt64 {
	authInfo := GetAuth(ctx)
	if authInfo == nil {
		return variant.SerializeInt64(0)
	}
	return authInfo.ID
}

// GetAuthUsername 从 context 中获取用户名
func GetAuthUsername(ctx context.Context) string {
	authInfo := GetAuth(ctx)
	if authInfo == nil {
		return ""
	}
	return authInfo.Username
}

// GetAuthRoleCode 从 context 中获取角色代码
func GetAuthRoleCode(ctx context.Context) string {
	authInfo := GetAuth(ctx)
	if authInfo == nil {
		return ""
	}
	return authInfo.RoleCode
}
