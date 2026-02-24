package request

import (
	"github.com/nilchaosky/go-nexus/nexus_enum"
	"github.com/nilchaosky/go-nexus/serialize/variant"
)

// UserListPageInput 用户列表分页输入条件
type UserListPageInput struct {
	Username string            `json:"username" label:"用户名"` // 用户名
	Status   nexus_enum.Status `json:"status" label:"状态"`    // 状态（枚举类型，可选，0表示未设置）
}

// GetUserListPageRequest 获取用户列表分页请求
type GetUserListPageRequest struct {
	Current int                `json:"current" binding:"required,min=1" label:"当前页码"` // 当前页码，从1开始（必填）
	Size    int                `json:"size" binding:"required,min=1" label:"每页数量"`    // 每页数量（必填）
	Input   *UserListPageInput `json:"input" label:"搜索条件"`                            // 搜索条件（指针类型）
}

// CreateUserRequest 创建用户请求
type CreateUserRequest struct {
	Phone    string                 `json:"phone" label:"手机号"`                              // 手机号
	Username string                 `json:"username" binding:"required,max=20" label:"用户名"` // 用户名（必填，最大20字符）
	Password string                 `json:"password" binding:"required,min=6" label:"密码"`   // 密码（必填，最少6字符）
	RoleID   variant.SerializeInt64 `json:"role_id" binding:"required" label:"角色ID"`        // 角色ID（必填）
}

// UpdateUserRequest 更新用户请求
type UpdateUserRequest struct {
	ID       variant.SerializeInt64 `json:"id" binding:"required" label:"用户ID"`             // 用户ID（必填）
	Phone    string                 `json:"phone" label:"手机号"`                              // 手机号
	Username string                 `json:"username" binding:"required,max=20" label:"用户名"` // 用户名（必填，最大20字符）
	RoleID   variant.SerializeInt64 `json:"role_id" binding:"required" label:"角色ID"`        // 角色ID（必填）
}

// ChangePasswordRequest 修改密码请求
type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required" label:"旧密码"`       // 旧密码（必填）
	NewPassword string `json:"new_password" binding:"required,min=6" label:"新密码"` // 新密码（必填，最少6字符）
}

// BatchDeleteUserRequest 批量删除用户请求
type BatchDeleteUserRequest struct {
	IDs []variant.SerializeInt64 `json:"ids" binding:"required,min=1" label:"用户ID列表"` // 用户ID列表（必填，至少一个）
}
