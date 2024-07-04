package resource

import (
	"context"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"go.uber.org/zap"
	kv1 "k8s.io/api/core/v1"
	errors2 "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/resource"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/metrics/pkg/apis/metrics/v1beta1"
	"k8s.io/utils/ptr"
)

type result struct {
	Result runtime.Object
	Err    error
}

func GetMetrics(ctx context.Context, registry client.SkafosRegistry, namespace, name string) (*dtos.SkafosMetrics, error) {
	skafosClient, err := registry.Get(ctx, namespace, name)
	if err != nil {
		logger.Error(ctx, "error getting skafos client", zap.Error(err))
		return nil, apperror.NewClientInstantiationError(err, namespace, name)
	}

	nodeCh := make(chan result, 1)
	nodeMetricsCh := make(chan result, 1)

	go func() {
		nodes, nodeErr := skafosClient.ClientSet().CoreV1().Nodes().List(ctx, v1.ListOptions{
			TimeoutSeconds: ptr.To[int64](2),
		})
		nodeCh <- result{nodes, nodeErr}
	}()

	go func() {
		nodeMetrics, nodeErr := skafosClient.Metrics().MetricsV1beta1().NodeMetricses().List(ctx, v1.ListOptions{
			TimeoutSeconds: ptr.To[int64](2),
		})
		nodeMetricsCh <- result{nodeMetrics, nodeErr}
	}()

	nodeResult := <-nodeCh
	metricResult := <-nodeMetricsCh
	if nodeResult.Err != nil {
		return nil, apperror.NewInternalError(err)
	}
	if metricResult.Err != nil {
		if errors2.IsNotFound(metricResult.Err) {
			return nil, apperror.NewNotFoundError("metrics server not found")
		}
		return nil, apperror.NewInternalError(err)
	}
	nodes := nodeResult.Result.(*kv1.NodeList)
	metrics := metricResult.Result.(*v1beta1.NodeMetricsList)
	return buildSkafosMetrics(nodes, metrics)
}

func buildSkafosMetrics(nodeList *kv1.NodeList, metricResult *v1beta1.NodeMetricsList) (*dtos.SkafosMetrics, error) {
	skafosMetrics := emptyResult()
	for _, node := range nodeList.Items {
		if isControlplane(node) {
			continue
		}
		metrics := getNodeMetric(node.Name, metricResult)
		usedCpus := cpuMillis(metrics.Usage.Cpu())
		usedMemory := memoryMb(metrics.Usage.Memory())

		skafosMetrics.Cpu.Capacity += cpuMillis(node.Status.Capacity.Cpu())
		skafosMetrics.Memory.Capacity += memoryMb(node.Status.Capacity.Memory())

		skafosMetrics.Cpu.Allocatable += cpuMillis(node.Status.Allocatable.Cpu())
		skafosMetrics.Memory.Allocatable += memoryMb(node.Status.Allocatable.Memory())

		skafosMetrics.Cpu.Used += usedCpus
		skafosMetrics.Memory.Used += usedMemory
	}
	return skafosMetrics, nil
}

func cpuMillis(quantity *resource.Quantity) int64 {
	usedCpus, ok := quantity.AsInt64()
	if !ok {
		return quantity.MilliValue()
	}
	return usedCpus * 1000
}

func memoryMb(quantity *resource.Quantity) int64 {
	usedMemory, ok := quantity.AsInt64()
	if !ok {
		usedMemory = quantity.MilliValue()
		usedMemory = usedMemory / 1024
		return usedMemory
	}
	usedMemory = (usedMemory / 1024) / 1024
	return usedMemory
}

func getNodeMetric(name string, list *v1beta1.NodeMetricsList) *v1beta1.NodeMetrics {
	for _, m := range list.Items {
		if m.Name == name {
			return &m
		}
	}
	return nil
}

func isControlplane(node kv1.Node) bool {
	taints := node.Spec.Taints
	if len(taints) < 1 {
		return false
	}
	for _, taint := range taints {
		if taint.Key == "node-role.kubernetes.io/control-plane" {
			return true
		}
	}
	return false
}

func emptyResult() *dtos.SkafosMetrics {
	return &dtos.SkafosMetrics{
		Cpu:    &dtos.Metric{},
		Memory: &dtos.Metric{},
	}
}
