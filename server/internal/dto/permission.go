package dto

import (
	"github.com/nilchaosky/go-nexus/enum"
	"github.com/nilchaosky/go-nexus/serialize/variant"
)

type PermissionDto struct {
	ID       variant.SerializeInt64 `json:"id"`
	Code     string                 `json:"code"`
	Title    string                 `json:"title"`
	API      *string                `json:"api"`
	Method   *nexus_enum.Method     `json:"method"`
	Children []PermissionDto        `json:"children"`
}
