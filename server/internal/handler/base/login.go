package base

import (
	"net/http"
	"server/internal/service"
	"server/internal/types/request"

	"github.com/gin-gonic/gin"
	nexus_types "github.com/nilchaosky/go-nexus/types"
	"github.com/nilchaosky/go-nexus/validator"
)

// Login 用户登录
func Login(c *gin.Context) {
	var req request.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.String(http.StatusBadRequest, "参数校验错误："+validator.FormatFieldErrors(&req, err))
		return
	}

	resp, err := service.Get().Base().Login(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusOK, nexus_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexus_types.Success(resp))
}
