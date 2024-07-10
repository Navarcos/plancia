package types

type ExternalCluster struct {
	Name       string
	Namespace  string
	Provider   string
	Kubeconfig []byte
}
