package main

import (
	"server/internal/model"

	"gorm.io/gen"
)

func main() {
	g := gen.NewGenerator(gen.Config{
		OutPath:       "./internal/query",
		Mode:          gen.WithDefaultQuery | gen.WithQueryInterface | gen.WithoutContext,
		FieldNullable: true,
	})

	g.ApplyBasic(
		model.User{},
		model.Role{},
		model.Permission{},
		model.RolePermission{},
	)

	g.Execute()
}
