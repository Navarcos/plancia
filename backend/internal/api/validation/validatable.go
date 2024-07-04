package validation

type Validatable interface {
	Valid() error
}
