package user

import (
	"net/http"
	"server/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/nilchaosky/go-nexus/serialize/variant"
	nexus_types "github.com/nilchaosky/go-nexus/types"
)

// GetCurrentUser 获取当前用户
func GetCurrentUser(c *gin.Context) {
	userID := c.MustGet("id").(variant.SerializeInt64)

	resp, err := service.Get().User().GetUserByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusOK, nexus_types.Error(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nexus_types.Success(resp))
}
