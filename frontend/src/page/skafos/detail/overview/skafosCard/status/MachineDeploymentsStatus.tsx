const formatDeploymentStatus = (
  status: any
): { key: string; value: string }[] => {
  return [
    { key: "Selector", value: `${status.selector}` },
    { key: "Phase", value: `${status.phase}` },
    { key: "Ready Replicas", value: `${status.readyReplicas}` + "/" + `${status.replicas}` },
    { key: "Updated Replicas", value: `${status.updatedReplicas}`+ "/" + `${status.replicas}` },
    { key: "Unavailable Replicas", value: `${status.unavailableReplicas}`+ "/" + `${status.replicas}` },
  ];
};

export function formatMachineDeploymentStatus() {

}

interface MachineDeploymentsStatus {
  phase: string;
  readyReplicas: string;
  updatedReplicas: string;
  unavailableReplicas: string;
}

export default formatDeploymentStatus;
