package role

import (
	"net/http"
	"server/internal/service"

	"github.com/gin-gonic/gin"
	nexus_types "github.com/nilchaosky/go-nexus/types"
)

// GetRoleByID 根据ID获取角色
func GetRoleByID(c *gin.Context) {
	var req nexus_types.GinIDRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusOK, nexus_types.Error("参数错误: "+err.Error()))
		return
	}

	role, err := service.Get().Role().GetRoleByID(c.Request.Context(), req.ID)
	if err != nil {
		c.JSON(http.StatusOK, nexus_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexus_types.Success(role))
}
