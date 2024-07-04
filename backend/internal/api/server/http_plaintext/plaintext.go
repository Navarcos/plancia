package http_plaintext

import (
	"net/http"
)

func Encode(w http.ResponseWriter, _ *http.Request, status int, v []byte) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(status)
	_, _ = w.Write(v)
}
