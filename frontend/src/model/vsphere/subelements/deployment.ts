import {AddProps} from "./element";

export interface Deployment {
    apiVersion: string;
    kind: string;
    metadata: Metadata;
    spec: Spec;

}

export interface Metadata {
    annotations: AddProps[];
    creationTimestamp: string;
    deletionGracePeriodSeconds: number;
    deletionTimestamp: string;
    finalizers: string[];
    generateName: string;
    generation: number;
    labels: AddProps;
    managedFields: ManagedField[];
    name: string;
    namespace: string;
    ownerReferences: OwnerReference[];
    resourceVersion: string;
    selfLink: string;
    uid: string;
}

interface ManagedField {
    apiVersion: string;
    fieldsType: string;
    fieldsV1: string;
    manager: string;
    operation: string;
    subresource: string;
    time: string;
}

interface OwnerReference {
    apiVersion: string;
    blockOwnerDeletion: boolean;
    controller: boolean;
    kind: string;
    name: string;
    uid: string;
}

interface Spec {
    activeDeadlineSeconds: number;
    affinity: string;
    automountServiceAccountToken: boolean;
    containers: Container[];

}

interface Container {
    args: string[];
    command: string[];
    env: Env[];
    envFrom: EnvFrom[];
    image: string;
    imagePoolPolicy: string;
    lifecycle: string;
    livenessProbe: string;
    name: string;
    ports: Port[];
    readinessProbe: string;
    resizePolicy: ResizePolicy[];
    resource: string;
    restartPolicy: string;
    securityContext: string;
    startupProbe: string;
    stdin: boolean;
    stdinOnce: boolean;
    terminationMessagePath: string;
    terminationMessagePolicy: string;
    tty: boolean;
    volumeDevices: VolumeDevice[];
    volumeMounts: VolumeMount[];
    workingDir: string;
}

interface VolumeMount {
    mountPath: string;
    mountPropagation: string;
    name: string;
    readonly: boolean;
    recursiveReadOnly: boolean;
    subPath: string;
    subPathExpr: string;
}

interface VolumeDevice {
    devicePath: string;
    name: string;
}

interface Env {
    name: string;
    value: string;
    valueFrom: string;
}

interface EnvFrom {
    configMapRef: string;
    prefix: string;
    secretRef: string;
}

interface Port {
    containerPort: number;
    hostIP: string;
    hostPort: number;
    name: string;
    protocol: string;
}

interface ResizePolicy {
    resourceName: string;
    restartPolicy: string;
}

export interface DeploymentWatch {
    object: string;
    type: string;
}

export interface DeploymentList {
    object: AdditionalProp1;
}

interface AdditionalProp1 {
}
