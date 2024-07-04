import {DataItem} from "../controlPlane/ControlPlaneCard";

const formatConditions = (conditions: any[]): DataItem[] => {
    if (conditions && conditions.length > 0) {
        return conditions.map((condition) => {
            return {
                key: condition.type,
                value:
                condition.status,
                // {key: "Severity", value: condition.severity},
                // {key: "Reason", value: condition.reason},
                // {key: "Message", value: condition.message},
                // {key: "LastTransitionTime", value: condition.lastTransitionTime},
            }
        })
    }
    return [];

};

const formatControlPlaneStatus = (status: any): DataItem[] => {
    if (status) {
        return [
            {key: "Ready Replicas", value: `${status.readyReplicas}` + '/' + `${status.replicas}`},
            {key: "Updated Replicas", value: `${status.updatedReplicas}` + '/' + `${status.replicas}`},
            {key: "Unavailable Replicas", value: `${status.unavailableReplicas}` + '/' + `${status.replicas}`},
            {key: "Conditions", value: formatConditions(status.conditions)},
        ];
    }
    return []
};

export default formatControlPlaneStatus;
