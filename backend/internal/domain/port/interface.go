package port

import (
	"context"
	"github.com/activadigital/plancia/internal/domain/types"
)

type AuthInterface interface {
	CreateAuthResources(ctx context.Context, skafos types.Skafos) error
	DeleteAuthResources(ctx context.Context, namespace, skafosName string) error
}
