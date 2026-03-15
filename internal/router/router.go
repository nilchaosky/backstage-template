package router

import (
	"server/global"
	"server/internal/middleware"

	"github.com/gin-gonic/gin"
)

// Router 路由组管理器
type Router struct {
	engine *gin.Engine
}

// NewRouter 创建路由组管理器
func NewRouter(engine *gin.Engine) *Router {
	return &Router{
		engine: engine,
	}
}

// RegisterRoutes 注册所有业务路由
func (r *Router) RegisterRoutes() {
	prefix := global.Config.Server.RoutePrefix
	// 根据前缀创建路由组（prefix为空时Group("")也会正常工作）
	publicGroup := r.engine.Group(prefix)
	privateGroup := r.engine.Group(prefix)

	// 私有路由组应用认证中间件
	privateGroup.Use(middleware.AuthMiddleware())

	r.registerBase(publicGroup, privateGroup)
	r.registerUser(privateGroup)
	r.registerRole(privateGroup)
}
