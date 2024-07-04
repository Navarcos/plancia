package httpjson

import (
	"encoding/json"
	"fmt"
	"github.com/activadigital/plancia/internal/api/validation"
	"net/http"
	"reflect"
)

func Encode[T any](w http.ResponseWriter, _ *http.Request, status int, v T) error {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(status)
	if !reflect.ValueOf(v).IsZero() {
		if err := json.NewEncoder(w).Encode(&v); err != nil {
			return fmt.Errorf("encode json: %w", err)
		}
	}
	return nil
}

func decode[T any](r *http.Request) (T, error) {
	var v T
	if err := json.NewDecoder(r.Body).Decode(&v); err != nil {
		return v, fmt.Errorf("decode json: %w", err)
	}
	return v, nil
}

func DecodeValid[T validation.Validatable](r *http.Request) (T, error) {
	v, err := decode[T](r)
	if err != nil {
		return v, fmt.Errorf("decode json: %w", err)
	}
	if err = v.Valid(); err != nil {
		return v, err
	}
	return v, nil
}
