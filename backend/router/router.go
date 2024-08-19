package router

import (
	"github.com/gin-gonic/gin"
	"github.com/shutter-network/shutter-explorer/backend/internal/middleware"
	"github.com/shutter-network/shutter-explorer/backend/internal/usecase"
)

func NewRouter(usecases *usecase.Usecases) *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.Use(middleware.ErrorHandler())
	api := router.Group("/api")
	{
		hello := api.Group("/hello")
		hello.GET("", usecases.Greeter.QueryGreeter)
	}
	{
		dec := api.Group("/decrypted")
		dec.GET("/get-tx", usecases.Greeter.QueryDecryptedTX)
	}

	return router
}
