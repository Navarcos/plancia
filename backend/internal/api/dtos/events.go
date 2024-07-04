package dtos

import "time"

type SkafosEventList struct {
	ResourceVersion    string        `json:"resourceVersion,omitempty"`
	Items              []SkafosEvent `json:"items"`
	Continue           string        `json:"continue,omitempty"`
	RemainingItemCount *int64        `json:"remainingItemCount,omitempty"`
}

type SkafosEvent struct {
	Id             string    `json:"id"`
	Type           string    `json:"type,omitempty"`
	Action         string    `json:"action,omitempty"`
	Reason         string    `json:"reason,omitempty"`
	Message        string    `json:"message,omitempty"`
	Namespace      string    `json:"namespace,omitempty"`
	InvolvedObject string    `json:"involvedObject,omitempty"`
	Count          int32     `json:"count,omitempty"`
	FirstTimestamp time.Time `json:"firstTimestamp,omitempty"`
	LastTimestamp  time.Time `json:"lastTimestamp,omitempty"`
}
