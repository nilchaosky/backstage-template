package router

import (
	"server/internal/handler/base"

	"github.com/gin-gonic/gin"
)

// registerBase 注册基础路由
func (r *Router) registerBase(publicGroup *gin.RouterGroup, privateGroup *gin.RouterGroup) {
	// 公开路由：登录
	publicGroup.POST("/login", base.Login)

	// 私有路由：退出登录（需要认证）
	privateGroup.GET("/logout", base.Logout)
}
