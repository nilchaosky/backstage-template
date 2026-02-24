package router

import (
	"server/internal/handler/user"

	"github.com/gin-gonic/gin"
)

// registerUser 注册用户路由
func (r *Router) registerUser(privateGroup *gin.RouterGroup) {
	userGroup := privateGroup.Group("/user")
	{
		// 获取当前用户信息
		userGroup.GET("/current", user.GetCurrentUser)
		// 根据ID获取用户
		userGroup.GET("", user.GetUserByID)
		// 分页获取用户列表
		userGroup.POST("/list/page", user.GetUserListPage)
		// 创建用户
		userGroup.POST("", user.CreateUser)
		// 更新用户
		userGroup.PUT("", user.UpdateUser)
		// 修改密码
		userGroup.PUT("/password", user.ChangePassword)
		// 删除用户
		userGroup.DELETE("", user.DeleteUser)
		// 批量删除用户
		userGroup.DELETE("/batch", user.BatchDeleteUser)
	}
}
