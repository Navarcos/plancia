package dtos

type SkafosMetrics struct {
	Cpu    *Metric `json:"cpu"`
	Memory *Metric `json:"memory"`
}

type Metric struct {
	Capacity    int64 `json:"capacity"`
	Allocatable int64 `json:"allocatable"`
	Used        int64 `json:"used"`
}
