package model

import (
	"github.com/nilchaosky/go-nexus/gorm_model/postgres"
	"github.com/nilchaosky/go-nexus/serialize/variant"
)

// RolePermission 角色权限关联模型
type RolePermission struct {
	postgres.Snowflake `gorm:"embedded"`
	RoleID             variant.SerializeInt64 `json:"role_id" gorm:"column:role_id;type:bigint;not null;index;comment:角色ID"`
	PermissionID       variant.SerializeInt64 `json:"permission_id" gorm:"column:permission_id;type:bigint;not null;index;comment:权限ID"`
}

// TableName 指定表名
func (RolePermission) TableName() string {
	return "role_permission"
}
