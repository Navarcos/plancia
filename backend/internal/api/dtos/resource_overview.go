package dtos

import (
	appsv1 "k8s.io/api/apps/v1"
	v1 "k8s.io/api/core/v1"
)

type ResourceOverview struct {
	PodStats         PodStats      `json:"pods"`
	DeploymentStats  ResourceStats `json:"deployments"`
	StatefulSetStats ResourceStats `json:"statefulsets"`
	ReplicaSetStats  ResourceStats `json:"replicasets"`
}

type PodStats struct {
	Total     int `json:"total"`
	Running   int `json:"running"`
	Pending   int `json:"pending"`
	Succeeded int `json:"succeeded"`
	Failed    int `json:"failed"`
}

func (s *PodStats) IncrementPhase(pod v1.Pod) {
	s.Total += 1
	switch pod.Status.Phase {
	case v1.PodRunning:
		s.Running += 1
		return
	case v1.PodPending:
		s.Pending += 1
		return
	case v1.PodSucceeded:
		s.Succeeded += 1
		return
	case v1.PodFailed:
		s.Failed += 1
		return
	}
}

type ResourceStats struct {
	Total   int `json:"total"`
	Running int `json:"running"`
	Pending int `json:"pending"`
}

func (s *ResourceStats) IncrementDeploy(deployment appsv1.Deployment) {
	s.Total += 1
	if deployment.Status.Replicas == deployment.Status.AvailableReplicas {
		s.Running += 1
		return
	}
	s.Pending += 1
}

func (s *ResourceStats) IncrementStatefulSet(statefulSet appsv1.StatefulSet) {
	s.Total += 1
	if statefulSet.Status.Replicas == statefulSet.Status.AvailableReplicas {
		s.Running += 1
		return
	}
	s.Pending += 1
}

func (s *ResourceStats) IncrementReplicaSet(replicaSet appsv1.ReplicaSet) {
	s.Total += 1
	if replicaSet.Status.Replicas == replicaSet.Status.AvailableReplicas {
		s.Running += 1
		return
	}
	s.Pending += 1
}
