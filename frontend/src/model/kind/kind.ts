export interface KindCreationRequest {
  name: string;
  namespace: string;
  masterNodes: number;
  workerNodes: number;
  kubernetesVersion: string;
}

export function parseCreationRequest(values: any): KindCreationRequest {
  return {
    namespace: values.namespace,
    name: values.name,
    masterNodes: values.masterNodes,
    workerNodes: values.workerNodes,
    kubernetesVersion: values.kubernetesVersion,
  };
}
