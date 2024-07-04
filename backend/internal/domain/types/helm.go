package types

type HelmRelease struct {
	Chart     string
	Version   string
	Release   string
	Namespace string
	Values    map[string]interface{}
}
