package role

import (
	"net/http"
	"regexp"
	"server/internal/service"
	"server/internal/types/request"

	"github.com/gin-gonic/gin"
	nexus_types "github.com/nilchaosky/go-nexus/types"
)

// CreateRole 创建角色
func CreateRole(c *gin.Context) {
	var req request.CreateRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusOK, nexus_types.Error("参数错误: "+err.Error()))
		return
	}

	// 校验角色代码格式：只支持大写字母和下划线
	codeRegex := `^[A-Z_]+$`
	matched, err := regexp.MatchString(codeRegex, req.Code)
	if err != nil || !matched {
		c.JSON(http.StatusOK, nexus_types.Error("角色代码只能包含大写字母和下划线"))
		return
	}

	if err := service.Get().Role().CreateRole(c.Request.Context(), &req); err != nil {
		c.JSON(http.StatusOK, nexus_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexus_types.SuccessWithNil())
}
