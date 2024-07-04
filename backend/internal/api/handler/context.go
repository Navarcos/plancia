package handler

import (
	"context"
	"net/http"
)

type ErrorKey string

const ErrKey ErrorKey = "error"

func setErrorInRequestContext(request *http.Request, err error) {
	ctx := request.Context()
	newContext := context.WithValue(ctx, ErrKey, err)
	*request = *request.WithContext(newContext)
}
