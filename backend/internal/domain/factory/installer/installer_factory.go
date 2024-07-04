package installer

import (
	"context"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/domain/types"
	"time"
)

type DriverInstallationStrategyFactory interface {
	GetInstaller(provider string, timeout time.Duration) (DriverInstallationStrategy, error)
}

type driverInstallationStrategyFactory struct {
	registry client.SkafosRegistry
}

func NewInstallerFactory(registry client.SkafosRegistry) DriverInstallationStrategyFactory {
	return &driverInstallationStrategyFactory{
		registry: registry,
	}
}

func (f *driverInstallationStrategyFactory) GetInstaller(provider string, timeout time.Duration) (DriverInstallationStrategy, error) {
	switch provider {
	case types.Vsphere.String():
		return newVsphereInstaller(f.registry, timeout), nil
	case types.Docker.String():
		return newDockerInstaller(f.registry, timeout), nil
	case types.Azure.String():
		return newAzureInstaller(), nil
	default:
		return nil, apperror.NewProviderError(provider)
	}
}

type DriverInstallationStrategy interface {
	InstallDrivers(ctx context.Context, skafos types.Skafos) error
}
