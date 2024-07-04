package apperror

import (
	"fmt"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

type Action string

const (
	List   Action = "list"
	Get    Action = "get"
	Create Action = "create"
	Apply  Action = "apply"
	Delete Action = "delete"
	Patch  Action = "patch"
)

type KubeError struct {
	err      error
	action   Action
	resource string
	name     string
}

func NewKubeError(err error, action Action, resource string, name string) KubeError {
	return KubeError{
		err:      err,
		action:   action,
		resource: resource,
		name:     name,
	}
}

func (e KubeError) Error() string {
	if e.name != "" {
		return fmt.Sprintf("error %s %s %s: %s", e.action, e.resource, e.name, e.err)
	}
	return fmt.Sprintf("error %s %s: %s", e.action, e.resource, e.err)
}

func (e KubeError) Unwrap() error {
	return e.err
}

type ClientInstantiationError struct {
	err       error
	namespace string
	name      string
}

func NewClientInstantiationError(err error, namespace, name string) ClientInstantiationError {
	return ClientInstantiationError{err: err, namespace: namespace, name: name}
}

func (e ClientInstantiationError) Error() string {
	return fmt.Sprintf("failed to instantiate client for %s/%s", e.namespace, e.name)
}

type InternalError struct {
	error
}

func NewInternalError(err error) InternalError {
	return InternalError{err}
}

type NotReadyError struct {
	objectKind schema.ObjectKind
	name       string
	namespace  string
}

func NewNotReadyError(objectKind schema.ObjectKind, name, namespace string) error {
	return NotReadyError{
		objectKind: objectKind,
		name:       name,
		namespace:  namespace,
	}
}

func (e NotReadyError) Error() string {
	return fmt.Sprintf(
		"cannot update resource %s/%s, %s, in namespace %s: not ready",
		e.objectKind.GroupVersionKind().Group,
		e.objectKind.GroupVersionKind().Kind,
		e.name,
		e.namespace,
	)
}

type ProviderError struct {
	provider string
}

func NewProviderError(provider string) ProviderError {
	return ProviderError{provider: provider}
}

func (e ProviderError) Error() string {
	return fmt.Sprintf("unknown provider %s", e.provider)
}

type TimeoutError struct {
	action   string
	resource string
	name     string
}

func NewTimeoutError(action string, resource string, name string) TimeoutError {
	return TimeoutError{action: action, resource: resource, name: name}
}

func (e TimeoutError) Error() string {
	return fmt.Sprintf("timeout %s %s, %s ", e.action, e.resource, e.name)
}

type ValidationError struct {
	message string
}

func NewValidationError(message string) ValidationError {
	return ValidationError{
		message: message,
	}
}

func (e ValidationError) Error() string {
	return e.message
}

type ConflictError struct {
	message string
}

func NewConflictError(message string) ConflictError {
	return ConflictError{
		message: message,
	}
}

func (e ConflictError) Error() string {
	return e.message
}

type NotFoundError struct {
	message string
}

func NewNotFoundError(message string) NotFoundError {
	return NotFoundError{
		message: message,
	}
}

func (e NotFoundError) Error() string {
	return e.message
}
