package base

import (
	"net/http"
	"server/internal/service"
	"server/internal/types/request"

	"github.com/gin-gonic/gin"
	"github.com/nilchaosky/go-nexus/nexusres_types"
	"github.com/nilchaosky/go-nexus/redis"
	"github.com/nilchaosky/go-nexus/validator"
)

// Login 用户登录
func Login(c *gin.Context) {
	var req request.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.String(http.StatusBadRequest, "参数校验错误："+validator.FormatFieldErrors(&req, err))
		return
	}

	redisClient := redis.GetDefaultClient()
	resp, err := service.Get().Base().Login(c.Request.Context(), redisClient, &req)
	if err != nil {
		c.JSON(http.StatusOK, nexusres_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexusres_types.Success(resp))
}
