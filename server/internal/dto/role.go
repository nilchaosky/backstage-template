package dto

import (
	"github.com/nilchaosky/go-nexus/nexus_enum"
	"github.com/nilchaosky/go-nexus/serialize/variant"
)

// RoleDto 角色数据传输对象
type RoleDto struct {
	ID        variant.SerializeInt64 `json:"id"`
	Title     string                 `json:"title"`
	Code      string                 `json:"code"`
	Status    nexus_enum.Status      `json:"status"`
	CreatedAt string                 `json:"created_at"`
}
