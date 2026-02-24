package base

import (
	"net/http"
	"server/internal/ctxutil"
	"server/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/nilchaosky/go-nexus/nexusres_types"
	"github.com/nilchaosky/go-nexus/redis"
)

// Logout 用户退出登录
func Logout(c *gin.Context) {
	// 从上下文中获取用户ID
	authInfo := ctxutil.GetAuth(c.Request.Context())
	if authInfo == nil {
		c.JSON(http.StatusOK, nexusres_types.Error("未找到用户信息"))
		return
	}

	userID := authInfo.ID.String()
	redisClient := redis.GetDefaultClient()

	if err := service.Get().Base().Logout(c.Request.Context(), redisClient, userID); err != nil {
		c.JSON(http.StatusOK, nexusres_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexusres_types.SuccessWithNil())
}
