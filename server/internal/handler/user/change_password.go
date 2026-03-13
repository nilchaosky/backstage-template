package user

import (
	"net/http"
	"server/internal/service"
	"server/internal/types/request"

	"github.com/gin-gonic/gin"
	nexus_types "github.com/nilchaosky/go-nexus/types"
)

// ChangePassword 修改密码
func ChangePassword(c *gin.Context) {
	var req request.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusOK, nexus_types.Error("参数错误: "+err.Error()))
		return
	}

	if err := service.Get().User().ChangePassword(c.Request.Context(), &req); err != nil {
		c.JSON(http.StatusOK, nexus_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexus_types.SuccessWithNil())
}
