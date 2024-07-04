package util

type Predicate[T any] func(elem T) bool
type Function[T, V any] func(elem T) V

func Filter[T any](input []T, predicate Predicate[T]) []T {
	output := make([]T, 0, len(input))
	for _, elem := range input {
		if predicate(elem) {
			output = append(output, elem)
		}
	}
	return output
}

func Map[T, V any](input []T, function Function[T, V]) []V {
	output := make([]V, 0, len(input))
	for _, elem := range input {
		output = append(output, function(elem))
	}
	return output
}

func FindFirst[T any](input []T, predicate Predicate[T]) *T {
	for _, elem := range input {
		if predicate(elem) {
			return &elem
		}
	}
	return nil
}
