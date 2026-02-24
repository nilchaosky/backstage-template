package user

import (
	"net/http"
	"server/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/nilchaosky/go-nexus/nexusres_types"
	"github.com/nilchaosky/go-nexus/redis"
	"github.com/nilchaosky/go-nexus/serialize/variant"
)

// GetUserByID 根据ID获取用户
func GetUserByID(c *gin.Context) {
	var req nexusres_types.GinIDRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusOK, nexusres_types.Error("参数错误: "+err.Error()))
		return
	}

	redisClient := redis.GetDefaultClient()
	user, err := service.Get().User().GetUserByID(c.Request.Context(), redisClient, variant.SerializeInt64(req.ID))
	if err != nil {
		c.JSON(http.StatusOK, nexusres_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexusres_types.Success(user))
}
