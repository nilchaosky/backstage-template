package converter

import (
	"server/internal/dto"
	"server/internal/model"
	"time"
)

// ToUserDto 转换用户模型为DTO
func ToUserDto(user *model.User) *dto.UserDto {
	if user == nil {
		return nil
	}

	return &dto.UserDto{
		ID:        user.ID,
		Phone:     user.Phone,
		Username:  user.Username,
		RoleID:    user.RoleID,
		Status:    user.Status.Value,
		CreatedAt: user.CreatedAt.Format(time.DateTime),
	}
}
