package errors

import (
	"errors"
	"github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/api/handler"
	"github.com/activadigital/plancia/internal/api/server/httpjson"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"net/http"
)

func ErrorHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		next.ServeHTTP(w, r)
		value := r.Context().Value(handler.ErrKey)
		if value == nil {
			return
		}

		err := value.(error)
		var pd dtos.ProblemDetails
		var providerError apperror.ProviderError
		var internalError apperror.InternalError
		var kubeError apperror.KubeError
		var notReadyError apperror.NotReadyError
		var clientInstantiationError apperror.ClientInstantiationError
		var timeoutError apperror.TimeoutError
		var validationError apperror.ValidationError
		var conflictError apperror.ConflictError
		var notFound apperror.NotFoundError
		switch {
		case errors.As(err, &providerError):
			pd = dtos.ProblemDetailsFromError(err, r, "provider error", http.StatusInternalServerError)
		case errors.As(err, &internalError):
			pd = dtos.ProblemDetailsFromError(err, r, "internal error", http.StatusInternalServerError)
		case errors.As(err, &kubeError):
			pd = dtos.ProblemDetailsFromError(err, r, "kubernetes client error", http.StatusInternalServerError)
		case errors.As(err, &notReadyError):
			pd = dtos.ProblemDetailsFromError(err, r, "not ready error", http.StatusServiceUnavailable)
		case errors.As(err, &clientInstantiationError):
			pd = dtos.ProblemDetailsFromError(err, r, "client instantiation error", http.StatusInternalServerError)
		case errors.As(err, &timeoutError):
			pd = dtos.ProblemDetailsFromError(err, r, "timeout error", http.StatusInternalServerError)
		case errors.As(err, &validationError):
			pd = dtos.ProblemDetailsFromError(err, r, "validation error", http.StatusBadRequest)
		case errors.As(err, &conflictError):
			pd = dtos.ProblemDetailsFromError(err, r, "the resource already exists", http.StatusConflict)
		case errors.As(err, &notFound):
			pd = dtos.ProblemDetailsFromError(err, r, "the resource already exists", http.StatusNotFound)
		default:
			pd = dtos.ProblemDetailsFromError(err, r, "unknown error", http.StatusInternalServerError)
		}
		_ = httpjson.Encode(w, r, pd.Status, pd)
	})
}
