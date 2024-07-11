package dtos

import "github.com/go-playground/validator/v10"

type ExternalClusterDto struct {
	Namespace  string `json:"namespace" validate:"required"`
	Name       string `json:"name" validate:"required,max=20"`
	Provider   string `json:"provider" validate:"required,max=20"`
	Kubeconfig string `json:"kubeconfig" validate:"required"`
}

func (c ExternalClusterDto) Valid() error {
	v := validator.New()
	return v.Struct(c)
}
