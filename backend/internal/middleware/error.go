package middleware

import (
	"net/http"

	"github.com/shutter-network/shutter-explorer/backend/internal/error"

	"github.com/gin-gonic/gin"
)

func ErrorHandler() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Next()
		for _, err := range ctx.Errors {
			switch e := err.Err.(type) {
			case *error.Http:
				ctx.AbortWithStatusJSON(e.StatusCode, e)
			case error.Http:
				ctx.AbortWithStatusJSON(e.StatusCode, e)
			default:
				ctx.AbortWithStatusJSON(http.StatusInternalServerError, map[string]string{"message": "Service Unavailable"})
			}
		}
	}
}
