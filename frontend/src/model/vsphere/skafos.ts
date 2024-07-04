import {SkafosResourceStats, Status} from "./subelements/element"

export interface SkafosListItemResponse {
    kubernetesVersion: string;
    masterNodes: number;
    name: string;
    namespace: string;
    provider: string;
    status: Status;
    workerNodes: number;
}

export interface SkafosStats {
    deployments: SkafosResourceStats;
    pods: SkafosResourceStats;
    replicasets: SkafosResourceStats;
    statefulsets: SkafosResourceStats;

}

export function getColor(status: Status): any {
    if (!status.conditions) {
        return "error";
    }
    for (let condition of status.conditions) {
        if (condition.status !== "True") {
            return "error"
        }
    }
    return "success"
}

export function getTooltip(status: Status): string {
    if (!status.conditions) {
        return "";
    }
    for (let condition of status.conditions) {
        if (condition.status !== "True") {
            return condition.reason + ":" + condition.message
        }
    }
    return "Running"
}