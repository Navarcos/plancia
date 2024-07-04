package installer

import (
	"context"
	"github.com/activadigital/plancia/internal/domain/types"
)

type azureInstaller struct {
}

func newAzureInstaller() DriverInstallationStrategy {
	return &azureInstaller{}
}

func (v azureInstaller) InstallDrivers(ctx context.Context, skafos types.Skafos) error {
	panic("implement me")
}
