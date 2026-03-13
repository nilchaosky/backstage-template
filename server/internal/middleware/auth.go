package middleware

import (
	"net/http"
	"server/global"
	"server/internal/ctxutil"
	"server/internal/service"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/nilchaosky/go-nexus/logz"
	"github.com/nilchaosky/go-nexus/redis"
	"github.com/nilchaosky/go-nexus/serialize/variant"
	"github.com/nilchaosky/go-nexus/token"
	"go.uber.org/zap"
)

// AuthMiddleware JWT token验证中间件
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 检查白名单：如果路由和方法匹配白名单，直接放行
		requestPath := c.Request.URL.Path
		requestMethod := c.Request.Method

		for _, whiteItem := range global.WhiteList {
			if whiteItem.Route == requestPath && strings.ToUpper(whiteItem.Method) == requestMethod {
				c.Next()
				return
			}
		}

		// 验证和处理 token，获取用户 ID
		userID, ok := verifyAndProcessToken(c, requestPath, requestMethod)
		if !ok {
			return
		}

		// 基于用户权限校验当前请求
		if !checkPermission(c, userID, requestPath, requestMethod) {
			return
		}

		c.Next()
	}
}

// verifyAndProcessToken 验证并处理 token，返回用户ID和是否验证成功
func verifyAndProcessToken(c *gin.Context, requestPath, requestMethod string) (variant.SerializeInt64, bool) {
	// 从请求头中获取token
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		logz.Logger.Warn("认证失败：未提供认证令牌")
		c.String(http.StatusUnauthorized, "未提供认证令牌")
		c.Abort()
		return 0, false
	}

	// 解析Bearer token
	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || parts[0] != "Bearer" {
		logz.Logger.Warn("认证失败：认证令牌格式错误")
		c.String(http.StatusUnauthorized, "认证令牌格式错误")
		c.Abort()
		return 0, false
	}

	tokenString := parts[1]
	if tokenString == "" {
		logz.Logger.Warn("认证失败：认证令牌不能为空")
		c.String(http.StatusUnauthorized, "认证令牌不能为空")
		c.Abort()
		return 0, false
	}

	// 验证JWT token签名和过期时间
	if err := token.Verify(global.Config.JWT.Secret, tokenString); err != nil {
		logz.Logger.Warn("认证失败：JWT token验证失败", zap.Error(err))
		c.String(http.StatusUnauthorized, "认证令牌无效或已过期")
		c.Abort()
		return 0, false
	}

	// 从token中提取用户信息
	extra, err := token.GetExtra(global.Config.JWT.Secret, tokenString)
	if err != nil {
		logz.Logger.Warn("认证失败：解析认证令牌失败", zap.Error(err))
		c.String(http.StatusUnauthorized, "解析认证令牌失败")
		c.Abort()
		return 0, false
	}

	// 提取用户ID
	idValue, ok := extra["id"]
	if !ok {
		logz.Logger.Warn("认证失败：token中缺少用户ID")
		c.String(http.StatusUnauthorized, "认证令牌格式错误：缺少用户ID")
		c.Abort()
		return 0, false
	}

	idStr, ok := idValue.(string)
	if !ok {
		logz.Logger.Warn("认证失败：用户ID类型错误")
		c.String(http.StatusUnauthorized, "认证令牌格式错误：用户ID类型错误")
		c.Abort()
		return 0, false
	}

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		logz.Logger.Warn("认证失败：用户ID格式错误", zap.Error(err))
		c.String(http.StatusUnauthorized, "用户ID格式错误")
		c.Abort()
		return 0, false
	}

	// 验证Redis中token是否有效
	// 验证token是否匹配
	storedAccessToken, _ := redis.Client.GetToken(c.Request.Context(), idStr)
	if storedAccessToken == "" {
		logz.Logger.Warn("认证失败：token已被撤销或用户已退出登录")
		c.String(http.StatusUnauthorized, "认证令牌已失效，请重新登录")
		c.Abort()
		return 0, false
	}

	if storedAccessToken != tokenString {
		logz.Logger.Warn("认证失败：token不匹配或已失效")
		c.String(http.StatusUnauthorized, "认证令牌已失效，请重新登录")
		c.Abort()
		return 0, false
	}

	// 提取用户名和角色代码
	username, _ := extra["username"].(string)
	roleCode, _ := extra["role_code"].(string)

	// 将用户信息存储到上下文中
	authInfo := &ctxutil.AuthInfo{
		ID:       variant.SerializeInt64(id),
		Username: username,
		RoleCode: roleCode,
	}
	c.Request = c.Request.WithContext(ctxutil.WithAuth(c.Request.Context(), authInfo))

	// 保持向后兼容，同时存储到 Gin context
	c.Set("id", variant.SerializeInt64(id))
	c.Set("username", username)
	c.Set("role_code", roleCode)

	return variant.SerializeInt64(id), true
}

// checkPermission 从用户服务获取 URI 列表并校验当前请求是否有权限
func checkPermission(c *gin.Context, userID variant.SerializeInt64, requestPath, requestMethod string) bool {
	userDto, err := service.Get().User().GetUserByID(c.Request.Context(), userID)
	if err != nil || userDto == nil {
		logz.Logger.Warn("权限校验失败：获取用户信息失败", zap.Error(err))
		c.String(http.StatusForbidden, "获取用户信息失败")
		c.Abort()
		return false
	}

	for _, uri := range userDto.UriList {
		if uri.Route == requestPath && strings.EqualFold(uri.Method, requestMethod) {
			return true
		}
	}

	logz.Logger.Warn("权限校验失败：无访问权限")
	c.String(http.StatusForbidden, "无访问权限")
	c.Abort()
	return false
}
