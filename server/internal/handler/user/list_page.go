package user

import (
	"net/http"
	"server/internal/service"
	"server/internal/types/request"

	"github.com/gin-gonic/gin"
	"github.com/nilchaosky/go-nexus/nexusres_types"
	"github.com/nilchaosky/go-nexus/redis"
)

// GetUserListPage 分页获取用户列表
func GetUserListPage(c *gin.Context) {
	var req request.GetUserListPageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusOK, nexusres_types.Error("参数错误: "+err.Error()))
		return
	}

	redisClient := redis.GetDefaultClient()
	page, err := service.Get().User().GetUserListPage(c.Request.Context(), redisClient, req.Current, req.Size, req.Input)
	if err != nil {
		c.JSON(http.StatusOK, nexusres_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexusres_types.SuccessPage(page))
}
