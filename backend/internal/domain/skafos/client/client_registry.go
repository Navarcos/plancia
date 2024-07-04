package client

import (
	"context"
	"errors"
	"fmt"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"github.com/activadigital/plancia/internal/domain/skafos/manager"
	"github.com/activadigital/plancia/internal/domain/types"
	"go.uber.org/zap"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/discovery"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	metricsv "k8s.io/metrics/pkg/client/clientset/versioned"
	"strings"
	"sync"
)

type SkafosRegistry interface {
	Init(ctx context.Context) error
	Set(ctx context.Context, namespace, name string, kubeconfig []byte) (*SClient, error)
	Unset(ctx context.Context, namespace, name string)
	Get(ctx context.Context, namespace string, name string) (*SClient, error)
}

type registry struct {
	clients       map[string]*SClient
	skafosManager *manager.Manager
	mut           sync.RWMutex
}

func NewClientRegistry(skafosManager *manager.Manager) SkafosRegistry {
	return &registry{
		clients:       make(map[string]*SClient),
		skafosManager: skafosManager,
	}
}

func (r *registry) Init(ctx context.Context) error {
	unstr, err := r.skafosManager.Resource(types.SecretGvr).List(ctx, metav1.ListOptions{})
	if err != nil {
		return apperror.NewKubeError(err, apperror.List, "secrets", "")
	}
	secrets := &v1.SecretList{}
	err = runtime.DefaultUnstructuredConverter.FromUnstructured(unstr.UnstructuredContent(), secrets)
	if err != nil {
		return err
	}
	for _, secret := range secrets.Items {
		if strings.HasSuffix(secret.Name, "-kubeconfig") {
			name := strings.TrimSuffix(secret.Name, "-kubeconfig")
			data := secret.Data["value"]
			_, err = r.Set(ctx, secret.Namespace, name, data)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func (r *registry) Unset(ctx context.Context, namespace, name string) {
	r.setClient(namespace, name, nil)
}

func (r *registry) Set(ctx context.Context, namespace, name string, kubeconfig []byte) (*SClient, error) {
	restConfig, err := clientcmd.RESTConfigFromKubeConfig(kubeconfig)
	if err != nil {
		return nil, apperror.NewClientInstantiationError(err, namespace, name)
	}
	err1 := Instrument(restConfig)
	dynClient, err2 := dynamic.NewForConfig(restConfig)
	discoveryClient, err3 := discovery.NewDiscoveryClientForConfig(restConfig)
	metricClient, err4 := metricsv.NewForConfig(restConfig)
	clientset, err6 := kubernetes.NewForConfig(restConfig)
	err = errors.Join(err1, err2, err3, err4, err6)
	if err != nil {
		return nil, apperror.NewClientInstantiationError(err, namespace, name)
	}

	skafosClient := New(namespace, name, kubeconfig, clientset, dynClient, discoveryClient, metricClient)
	r.setClient(namespace, name, skafosClient)
	return skafosClient, nil
}

func (r *registry) setClient(namespace, name string, client *SClient) {
	r.mut.Lock()
	defer r.mut.Unlock()
	key := buildClientKey(namespace, name)
	r.clients[key] = client
}

func (r *registry) Get(ctx context.Context, namespace string, name string) (*SClient, error) {
	key := buildClientKey(namespace, name)
	r.mut.RLock()
	defer r.mut.RUnlock()
	skafosClient, ok := r.clients[key]
	if ok {
		return skafosClient, nil
	}
	err := fmt.Errorf("client not found")
	logger.Error(ctx, "", zap.Error(err))
	return nil, apperror.NewClientInstantiationError(err, namespace, name)
}

func buildClientKey(namespace, name string) string {
	return fmt.Sprintf("%s-%s", namespace, name)
}
