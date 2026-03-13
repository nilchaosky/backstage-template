package dto

import (
	"github.com/nilchaosky/go-nexus/enum"
	"github.com/nilchaosky/go-nexus/serialize/variant"
)

// UserDto 用户数据传输对象
type UserDto struct {
	ID         variant.SerializeInt64 `json:"id"`
	Phone      string                 `json:"phone"`
	Username   string                 `json:"username"`
	RoleID     variant.SerializeInt64 `json:"role_id"`
	RoleCode   string                 `json:"role_code"`
	Permission []string               `json:"permission"`
	UriList    []Uri                  `json:"uri_list,omitempty" nexusmask:"true"`
	Status     nexus_enum.Status      `json:"status"`
	CreatedAt  string                 `json:"created_at"`
}

// Uri 接口地址与方法
type Uri struct {
	Route  string `json:"route"`
	Method string `json:"method"`
}
