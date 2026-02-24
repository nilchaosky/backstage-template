package main

import (
	"server/core"
	"server/initialize"
)

func initApp() {
	initialize.InitConfig()
	initialize.InitLog()
	initialize.InitRedis()
	// initialize.InitFile()
	initialize.InitDatabase()
	initialize.InitBase()
}

func main() {
	initApp()

	core.Run()
}
