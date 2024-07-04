package dtos

import "time"

type ReleaseDto struct {
	Name      string                 `json:"name,omitempty"`
	Namespace string                 `json:"namespace,omitempty"`
	Chart     string                 `json:"chart,omitempty"`
	Version   string                 `json:"version,omitempty"`
	Status    string                 `json:"status,omitempty"`
	Updated   time.Time              `json:"updated"`
	Values    map[string]interface{} `json:"values,omitempty"`
}
