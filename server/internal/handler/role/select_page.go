package role

import (
	"net/http"
	"server/internal/service"
	"server/internal/types/request"

	"github.com/gin-gonic/gin"
	"github.com/nilchaosky/go-nexus/nexusres_types"
	"github.com/nilchaosky/go-nexus/redis"
)

// GetRoleSelectPage 分页获取角色选择器列表
func GetRoleSelectPage(c *gin.Context) {
	var req request.GetRoleSelectPageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusOK, nexusres_types.Error("参数错误: "+err.Error()))
		return
	}

	redisClient := redis.GetDefaultClient()
	page, err := service.Get().Role().GetRoleSelectPage(c.Request.Context(), redisClient, req.Current, req.Size, req.Keyword)
	if err != nil {
		c.JSON(http.StatusOK, nexusres_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexusres_types.SuccessPage(page))
}
