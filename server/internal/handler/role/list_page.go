package role

import (
	"net/http"
	"server/internal/service"
	"server/internal/types/request"

	"github.com/gin-gonic/gin"
	nexus_types "github.com/nilchaosky/go-nexus/types"
)

// GetRoleListPage 分页获取角色列表
func GetRoleListPage(c *gin.Context) {
	var req request.GetRoleListPageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusOK, nexus_types.Error("参数错误: "+err.Error()))
		return
	}

	page, err := service.Get().Role().GetRoleListPage(c.Request.Context(), req.Current, req.Size, req.Input)
	if err != nil {
		c.JSON(http.StatusOK, nexus_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexus_types.SuccessPage(page))
}
