package base

import (
	"net/http"
	"server/internal/ctxutil"
	"server/internal/service"

	"github.com/gin-gonic/gin"
	nexus_types "github.com/nilchaosky/go-nexus/types"
)

// Logout 用户退出登录
func Logout(c *gin.Context) {
	// 从上下文中获取用户ID
	authInfo := ctxutil.GetAuth(c.Request.Context())
	if authInfo == nil {
		c.JSON(http.StatusOK, nexus_types.Error("未找到用户信息"))
		return
	}

	userID := authInfo.ID.String()

	if err := service.Get().Base().Logout(c.Request.Context(), userID); err != nil {
		c.JSON(http.StatusOK, nexus_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexus_types.SuccessWithNil())
}
