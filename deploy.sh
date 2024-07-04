#!/bin/bash

export NAVARCOS_DOMAIN_SUFFIX=".$(kubectl get node navarcos-control-plane -o jsonpath='{.status.addresses[0].address}').nip.io"
envsubst < deploy/templates/backend-ingress-template.yaml > deploy/resources/backend-ingress.yaml
envsubst < deploy/templates/frontend-ingress-template.yaml > deploy/resources/frontend-ingress.yaml
envsubst < deploy/templates/frontend-env-template.yaml > deploy/resources/frontend-env.yaml

kubectl apply -f deploy/resources