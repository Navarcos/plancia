package types

import "fmt"

type ExternalCluster struct {
	Name       string
	Namespace  string
	Provider   string
	Kubeconfig string
}

func (c *ExternalCluster) GetId() string {
	return fmt.Sprintf("%s-%s", c.Namespace, c.Name)
}
