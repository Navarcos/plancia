export default {
  formId: "kindForm",
  formField: {
    provider: {
      name: "provider",
      label: "Provider",
      requiredErrorMsg: "Provider is required",
      invalidErrorMsg: "Enter a valid Provider",
    },

    namespace: {
      name: "namespace",
      label: "Namespace",
      requiredErrorMsg: "Namespace is required",
      lowerCaseMsg: "Namespace must be in lowercase"
    },

    name: {
      name: "name",
      label: "Name",
      requiredErrorMsg: "Name is required",
      lowerCaseMsg: "Name must be in lowercase",
    },

    masterNodes: {
      name: "masterNodes",
      label: "Master Nodes",
      requiredErrorMsg: "Master Nodes are required",
      integerErrorMsg: "Integer number needed",
      maxErrorMsg: "Master Nodes quantity must be at most 10",
      minErrorMsg: "Master Nodes quantity must be at least 1",
      oddErrorMsg: "Master Nodes must be an odd number",
    },

    workerNodes: {
      name: "workerNodes",
      label: "Worker Nodes",
      requiredErrorMsg: "Worker Nodes are required",
      integerErrorMsg: "Integer number needed",
      maxErrorMsg: "Worker Nodes quantity must be at most 10",
      minErrorMsg: "Worker Nodes quantity must be at least 1",
    },

    kubernetesVersion: {
      name: "kubernetesVersion",
      label: "kubernetes Version",
      requiredErrorMsg: "Kubernetes version is required",
      invalidErrorMsg: "invalid kubernetes version",
    },
  },
};
