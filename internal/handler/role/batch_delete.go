package role

import (
	"net/http"
	"server/internal/service"
	"server/internal/types/request"

	"github.com/gin-gonic/gin"
	nexus_types "github.com/nilchaosky/go-nexus/types"
)

// BatchDeleteRole 批量删除角色
func BatchDeleteRole(c *gin.Context) {
	var req request.BatchDeleteRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusOK, nexus_types.Error("参数错误: "+err.Error()))
		return
	}

	ids := make([]int64, 0, len(req.IDs))
	for _, id := range req.IDs {
		ids = append(ids, id.Int64())
	}

	count, err := service.Get().Role().BatchDeleteRole(c.Request.Context(), ids)
	if err != nil {
		c.JSON(http.StatusOK, nexus_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexus_types.Success(&count))
}
