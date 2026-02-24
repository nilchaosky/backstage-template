package model

import (
	"github.com/nilchaosky/go-nexus/gorm-model/postgres"
	"github.com/nilchaosky/go-nexus/nexus_enum"
	"github.com/nilchaosky/go-nexus/serialize/variant"
)

// Permission 权限模型
type Permission struct {
	postgres.Snowflake `gorm:"embedded"`
	Code               string                 `json:"code" gorm:"column:code;type:varchar(50);uniqueIndex;not null;comment:权限代码，如user:create"`
	Title              string                 `json:"title" gorm:"column:title;type:varchar(50);not null;comment:权限名称"`
	ParentID           variant.SerializeInt64 `json:"parent_id" gorm:"column:parent_id;type:bigint;default:0;not null;index;comment:父权限ID，0表示顶级权限"`
	API                *string                `json:"api" gorm:"column:api;type:varchar(200);comment:API路径"`
	Method             *nexus_enum.Method     `json:"method" gorm:"column:method;type:varchar(10);comment:请求方法"`
}

// TableName 指定表名
func (Permission) TableName() string {
	return "permission"
}
