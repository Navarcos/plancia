#!/bin/bash

NAVARCOS_CA=$(kubectl get secret navarcos-ca -n gitlab -o jsonpath='{.data.navarcos-ca\.crt}'|base64 -d)
echo "${NAVARCOS_CA}"
