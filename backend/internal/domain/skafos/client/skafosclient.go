package client

import (
	"k8s.io/client-go/discovery"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/kubernetes"
	metricsv "k8s.io/metrics/pkg/client/clientset/versioned"
)

type SClient struct {
	namespace       string
	name            string
	kubeconfig      []byte
	clientset       kubernetes.Interface
	dynClient       dynamic.Interface
	discoveryClient discovery.DiscoveryInterface
	metricsClient   metricsv.Interface
}

func New(
	namespace, name string, kubeconfig []byte,
	clientset kubernetes.Interface,
	dynClient dynamic.Interface,
	discoveryClient discovery.DiscoveryInterface,
	metricsClient metricsv.Interface,
) *SClient {

	return &SClient{
		namespace:       namespace,
		name:            name,
		clientset:       clientset,
		dynClient:       dynClient,
		discoveryClient: discoveryClient,
		metricsClient:   metricsClient,
		kubeconfig:      kubeconfig,
	}
}

func (s *SClient) ClientSet() kubernetes.Interface {
	return s.clientset
}

func (s *SClient) Dynamic() dynamic.Interface {
	return s.dynClient
}

func (s *SClient) Discovery() discovery.DiscoveryInterface {
	return s.discoveryClient
}

func (s *SClient) Metrics() metricsv.Interface {
	return s.metricsClient
}

func (s *SClient) GetKubeconfig() []byte {
	return s.kubeconfig
}
