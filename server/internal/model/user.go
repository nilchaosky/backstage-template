package model

import (
	"github.com/nilchaosky/go-nexus/gorm-model/postgres"
	"github.com/nilchaosky/go-nexus/serialize/variant"
)

// User 用户模型
type User struct {
	postgres.Snowflake      `gorm:"embedded"`
	Phone                   string                 `json:"phone" gorm:"column:phone;type:varchar(11);uniqueIndex;comment:手机号"`
	Username                string                 `json:"username" gorm:"column:username;type:varchar(20);uniqueIndex;not null;comment:用户名"`
	Password                string                 `json:"-" gorm:"column:password;type:varchar(100);not null;comment:密码"`
	RoleID                  variant.SerializeInt64 `json:"role_id" gorm:"column:role_id;type:bigint;not null;index;comment:角色ID"`
	postgres.Status         `gorm:"embedded"`
	postgres.Timestamps     `gorm:"embedded"`
	postgres.OptimisticLock `gorm:"embedded"`
}

// TableName 指定表名
func (User) TableName() string {
	return "user"
}
