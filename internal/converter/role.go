package converter

import (
	"server/internal/dto"
	"server/internal/model"
	"time"
)

// ToRoleDto 转换角色模型为DTO
func ToRoleDto(role *model.Role) *dto.RoleDto {
	if role == nil {
		return nil
	}

	return &dto.RoleDto{
		ID:        role.ID,
		Title:     role.Title,
		Code:      role.Code,
		Status:    role.Status.Value,
		CreatedAt: role.CreatedAt.Format(time.DateTime),
	}
}
