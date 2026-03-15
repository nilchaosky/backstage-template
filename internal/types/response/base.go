package response

import "github.com/nilchaosky/go-nexus/serialize/variant"

// LoginResponse 登录响应
type LoginResponse struct {
	Token        string                 `json:"token"`         // 访问令牌
	RefreshToken string                 `json:"refresh_token"` // 刷新令牌
	ID           variant.SerializeInt64 `json:"id"`            // 用户ID
}
