package user

import (
	"net/http"
	"server/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/nilchaosky/go-nexus/serialize/variant"
	nexus_types "github.com/nilchaosky/go-nexus/types"
)

// GetUserByID 根据ID获取用户
func GetUserByID(c *gin.Context) {
	var req nexus_types.GinIDRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusOK, nexus_types.Error("参数错误: "+err.Error()))
		return
	}

	user, err := service.Get().User().GetUserByID(c.Request.Context(), variant.SerializeInt64(req.ID))
	if err != nil {
		c.JSON(http.StatusOK, nexus_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexus_types.Success(user))
}
