package creator

import (
	"context"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"github.com/activadigital/plancia/internal/domain/skafos/manager"
	"github.com/activadigital/plancia/internal/domain/types"
)

type CreationStrategyFactory interface {
	GetCreationStrategy(provider string) (CreationStrategy, error)
}

type creationStrategyFactory struct {
	skafosManager *manager.Manager
}

func NewCreationStrategyFactory(skafosManager *manager.Manager) CreationStrategyFactory {
	return &creationStrategyFactory{skafosManager: skafosManager}
}

func (c *creationStrategyFactory) GetCreationStrategy(provider string) (CreationStrategy, error) {
	switch provider {
	case types.Vsphere.String():
		return newVsphereCreator(c.skafosManager), nil
	case types.Docker.String():
		return newDockerCreator(c.skafosManager), nil
	default:
		return nil, apperror.NewProviderError(provider)
	}
}

type CreationStrategy interface {
	Create(ctx context.Context, skafos types.Skafos) error
}
