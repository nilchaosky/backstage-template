package user

import (
	"net/http"
	"server/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/nilchaosky/go-nexus/nexusres_types"
	"github.com/nilchaosky/go-nexus/redis"
	"github.com/nilchaosky/go-nexus/serialize/variant"
)

// GetCurrentUser 获取当前用户
func GetCurrentUser(c *gin.Context) {
	userID := c.MustGet("id").(variant.SerializeInt64)

	redisClient := redis.GetDefaultClient()
	resp, err := service.Get().User().GetUserByID(c.Request.Context(), redisClient, userID)
	if err != nil {
		c.JSON(http.StatusOK, nexusres_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexusres_types.Success(resp))
}
