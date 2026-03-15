package user

import (
	"net/http"
	"server/internal/service"
	"server/internal/types/request"

	"github.com/gin-gonic/gin"
	nexus_types "github.com/nilchaosky/go-nexus/types"
)

// GetUserListPage 分页获取用户列表
func GetUserListPage(c *gin.Context) {
	var req request.GetUserListPageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusOK, nexus_types.Error("参数错误: "+err.Error()))
		return
	}

	page, err := service.Get().User().GetUserListPage(c.Request.Context(), req.Current, req.Size, req.Input)
	if err != nil {
		c.JSON(http.StatusOK, nexus_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexus_types.SuccessPage(page))
}
