package dtos

import (
	"net/http"
)

type ProblemDetails struct {
	Type     string `json:"type"`
	Title    string `json:"title"`
	Status   int    `json:"status"`
	Detail   string `json:"detail"`
	Instance string `json:"instance"`
}

func ProblemDetailsFromError(err error, r *http.Request, title string, status int) ProblemDetails {
	return ProblemDetails{
		Type:     "about:blank",
		Title:    title,
		Status:   status,
		Detail:   err.Error(),
		Instance: r.URL.String(),
	}
}
