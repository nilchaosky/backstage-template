package model

import (
	"github.com/nilchaosky/go-nexus/gorm-model/postgres"
	"github.com/nilchaosky/go-nexus/nexus_enum"
)

// Role 角色模型
type Role struct {
	postgres.Snowflake      `gorm:"embedded"`
	Title                   string          `json:"title" gorm:"column:title;type:varchar(20);not null;comment:角色名称"`
	Code                    string          `json:"code" gorm:"column:code;type:varchar(20);uniqueIndex;not null;comment:角色代码"`
	IsSystem                nexus_enum.Flag `json:"-" gorm:"column:is_system;default:0;not null;comment:是否系统控制 1-是 2-否"`
	postgres.Status         `gorm:"embedded"`
	postgres.Timestamps     `gorm:"embedded"`
	postgres.OptimisticLock `gorm:"embedded"`
}

// TableName 指定表名
func (Role) TableName() string {
	return "role"
}
