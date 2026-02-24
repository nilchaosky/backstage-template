package user

import (
	"net/http"
	"server/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/nilchaosky/go-nexus/nexusres_types"
	"github.com/nilchaosky/go-nexus/redis"
)

// DeleteUser 删除用户
func DeleteUser(c *gin.Context) {
	var req nexusres_types.GinIDRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusOK, nexusres_types.Error("参数错误: "+err.Error()))
		return
	}

	redisClient := redis.GetDefaultClient()
	err := service.Get().User().DeleteUser(c.Request.Context(), redisClient, req.ID)
	if err != nil {
		c.JSON(http.StatusOK, nexusres_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexusres_types.SuccessWithNil())
}
