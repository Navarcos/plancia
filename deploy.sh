#!/bin/bash

export NAVARCOS_DOMAIN_SUFFIX=".$(kubectl get node navarcos-control-plane -o jsonpath='{.status.addresses[0].address}').nip.io"
envsubst < deploy/templates/backend-ingress-template.yaml > deploy/resources/backend-ingress.yaml
envsubst < deploy/templates/frontend-ingress-template.yaml > deploy/resources/frontend-ingress.yaml
envsubst < deploy/templates/frontend-env-template.yaml > deploy/resources/frontend-env.yaml

kubectl apply -f deploy/resources

NAVARCOS_CA=$(kubectl get secret navarcos-ca -n plancia -o jsonpath='{.data.ca\.crt}'|base64 -d)
echo "NAVARCOS CA:"
echo "${NAVARCOS_CA}"

FE_URL=$(kubectl get cm plancia-config -n plancia -o jsonpath='{.data.URLplancia-fe}')
echo Plancia is running on "${FE_URL}"
