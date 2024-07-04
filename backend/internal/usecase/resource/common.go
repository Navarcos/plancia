package resource

type ApiParams struct {
	SkafosNamespace   string
	SkafosName        string
	ResourceNamespace string
	ResourceName      string
	Limit             int
	Continue          string
	ResourceVersion   string
}
