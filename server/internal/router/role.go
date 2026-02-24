package router

import (
	"server/internal/handler/role"

	"github.com/gin-gonic/gin"
)

// registerRole 注册角色路由
func (r *Router) registerRole(privateGroup *gin.RouterGroup) {
	roleGroup := privateGroup.Group("/role")
	{
		// 根据ID获取角色
		roleGroup.GET("", role.GetRoleByID)
		// 分页获取角色列表
		roleGroup.POST("/list/page", role.GetRoleListPage)
		// 分页获取角色选择器列表
		roleGroup.POST("/select/page", role.GetRoleSelectPage)
		// 创建角色
		roleGroup.POST("", role.CreateRole)
		// 删除角色
		roleGroup.DELETE("", role.DeleteRole)
		// 批量删除角色
		roleGroup.DELETE("/batch", role.BatchDeleteRole)
	}
}
