#!/bin/bash

FE_URL=$(kubectl get ingress navarcos-ca -n plancia -o jsonpath='{.spec.rules[0].host}')
echo "https://${FE_URL}"