import {Condition} from "../subelements/element";

export interface VSphereCreationRequest {
    credentials: Credential;
    kubernetesVersion: string
    name: string
    namespace: string
    spec: Spec;
}

interface Credential {
    username: string;
    password: string;
}

interface Spec {
    controlPlaneEndpointIp: string;
    datacenter: string;
    datastore: string;
    datastoreUrl: string;
    dhcp: boolean;
    folder: string;
    ipPool: IpPool;
    machineTemplate: string;
    masterCpus: number;
    masterDisk: number;
    masterMem: number;
    masterNodes: number;
    nameserver1: string;
    nameserver2: string;
    network: string;
    resourcePool: string;
    server: string;
    sshAuthorizedKey: string,
    storagePolicy: string,
    vCenterTlsThumbprint: string,
    workerCpus: number;
    workerDisk: number;
    workerMem: number;
    workerNodes: number;
}

interface IpPool {
    networkEnd: string;
    networkGateway: string;
    networkStart: string;
    networkSubnet: string;
}

export interface SkafosGetResponse {
    name: string;
    namespace: string;
    provider: string;
    controlPlane: ControlPlane;
    machineDeployments: MachineDeployment[];
}

export interface ControlPlane {
    name: string;
    kubernetesVersion: string;
    nodes: number;
    status: ControlPlaneStatus

}

export interface ControlPlaneStatus {
    conditions: Condition[];
    failureMessage: string;
    failureReason: string;
    initialized: boolean;
    observedGeneration: number;
    ready: boolean;
    readyReplicas: number;
    replicas: number;
    selector: string;
    unavailableReplicas: number;
    updatedReplicas: number;
    version: string;
}


export interface MachineDeployment {
    name: string;
    nodes: number;
    status: MachineDeploymentStatus;
}

export interface MachineDeploymentStatus {
    phase: string;
    readyReplicas: number;
    replicas: number;
    unavailableReplicas: number;
    updatedReplicas: number;
}

export function parseCreationRequest(values: any): VSphereCreationRequest {
    return {
        namespace: values.namespace,
        name: values.name,
        kubernetesVersion: values.kubernetesVersion,
        credentials: {
            username: values.username,
            password: values.password,
        },
        spec: {
            controlPlaneEndpointIp: values.controlPlaneEndpointIP,
            datacenter: values.datacenter,
            datastore: values.datastore,
            datastoreUrl: values.datastoreUrl,
            dhcp: values.dhcp,
            folder: values.folder,
            ipPool: {
                networkEnd: values.networkEnd,
                networkGateway: values.networkGateway,
                networkStart: values.networkStart,
                networkSubnet: values.networkSubnet
            },
            machineTemplate: values.machineTemplate,
            masterCpus: values.masterCpus,
            masterDisk: values.masterDisk,
            masterMem: values.masterMem,
            masterNodes: values.masterNodes,
            nameserver1: values.nameserver1,
            nameserver2: values.nameserver2,
            network: values.network,
            resourcePool: values.resourcePool,
            server: values.server,
            sshAuthorizedKey: values.sshAuthorizedKey,
            storagePolicy: values.storagePolicy,
            vCenterTlsThumbprint: values.vCenterTlsThumbprint,
            workerCpus: values.workerCpus,
            workerDisk: values.workerDisk,
            workerMem: values.workerMem,
            workerNodes: values.workerNodes
        }
    };
}
