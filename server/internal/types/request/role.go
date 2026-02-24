package request

import (
	"github.com/nilchaosky/go-nexus/nexus_enum"
	"github.com/nilchaosky/go-nexus/serialize/variant"
)

// RoleListPageInput 角色列表分页输入条件
type RoleListPageInput struct {
	Title  string            `json:"title" label:"角色名称"` // 角色名称
	Code   string            `json:"code" label:"角色代码"`  // 角色代码
	Status nexus_enum.Status `json:"status" label:"状态"`  // 状态（枚举类型，可选，0表示未设置）
}

// GetRoleListPageRequest 获取角色列表分页请求
type GetRoleListPageRequest struct {
	Current int                `json:"current" binding:"required,min=1" label:"当前页码"` // 当前页码，从1开始（必填）
	Size    int                `json:"size" binding:"required,min=1" label:"每页数量"`    // 每页数量（必填）
	Input   *RoleListPageInput `json:"input" label:"搜索条件"`                            // 搜索条件（指针类型）
}

// CreateRoleRequest 创建角色请求
type CreateRoleRequest struct {
	Title string `json:"title" binding:"required,max=20" label:"角色名称"` // 角色名称（必填，最大20字符）
	Code  string `json:"code" binding:"required,max=20" label:"角色代码"`  // 角色代码（必填，最大20字符）
}

// BatchDeleteRoleRequest 批量删除角色请求
type BatchDeleteRoleRequest struct {
	IDs []variant.SerializeInt64 `json:"ids" binding:"required,min=1" label:"角色ID列表"` // 角色ID列表（必填，至少一个）
}

// GetRoleSelectPageRequest 获取角色选择器分页请求
type GetRoleSelectPageRequest struct {
	Current int    `json:"current" binding:"required,min=1" label:"当前页码"` // 当前页码，从1开始（必填）
	Size    int    `json:"size" binding:"required,min=1" label:"每页数量"`    // 每页数量（必填）
	Keyword string `json:"keyword" label:"搜索关键词"`                         // 搜索关键词（可选）
}
