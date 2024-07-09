export default {
  formId: "creationForm",
  formField: {
    //Provider

    provider: {
      name: "provider",
      label: "Provider",
      requiredErrorMsg: "Provider is required",
      invalidErrorMsg: "Enter a valid Provider",
    },

    //Credentials

    namespace: {
      name: "namespace",
      label: "Namespace",
      requiredErrorMsg: "Namespace is required",
    },
    name: {
      name: "name",
      label: "Name",
      requiredErrorMsg: "Name is required",
    },

    kubernetesVersion: {
      name: "kubernetesVersion",
      label: "Kubernetes Version",
      requiredErrorMsg: "Kubernetes Version is required",
      invalidErrorMsg: "Kubernetes version must be in x.y.z format",
    },

    username: {
      name: "username",
      label: "Username",
      requiredErrorMsg: "Username Version is required",
    },

    password: {
      name: "password",
      label: "Password",
      requiredErrorMsg: "Password is required",
      invalidMinLenghtErrorMsg:
        "Password is too short - should be 8 chars minimum",
      // invalidCharsErrorMsg:
      //   "Password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special",
    },

    server: {
      name: "server",
      label: "Server",
      requiredErrorMsg: "Server is required",
      invalidErrorMsg: "Enter a valid URL or domain name",
    },

    //Network
    datacenter: {
      name: "datacenter",
      label: "Datacenter",
      requiredErrorMsg: "Datacenter is required",
    },

    datastore: {
      name: "datastore",
      label: "Datastore",
      requiredErrorMsg: "Datastore is required",
    },

    datastoreUrl: {
      name: "datastoreUrl",
      label: "Data Store Url",
      requiredErrorMsg: "Data Store Url is required",
      invalidErrorMsg: "Enter a valid URL",
    },

    network: {
      name: "network",
      label: "Network",
      requiredErrorMsg: "Network is required",
    },

    sshAuthorizedKey: {
      name: "sshAuthorizedKey",
      label: "sshAuthorizedKey",
      requiredErrorMsg: "sshAuthorizedKey is required",
      invalidErrorMsg: "Invalid SSH Key format",
    },

    dhcp: {
      name: "dhcp",
      label: "DHCP",
      requiredErrorMsg: "DHCP is required",
    },

    folder: {
      name: "folder",
      label: "Folder",
      requiredErrorMsg: "Folder is required",
    },

    controlPlaneEndpointIP: {
      name: "controlPlaneEndpointIP",
      label: "Control Plane Endpoint IP",
      requiredErrorMsg: "Control Plane Endpoint IP is required",
      invalidErrorMsg: "Please use a valid IP address ",
    },

    //IP Pool (not required)
    networkEnd: {
      name: "networkEnd",
      label: "Network End",
      invalidErrorMsg: "Please use a valid IP address ",
    },

    networkSubnet: {
      name: "networkSubnet",
      label: "Network Subnet",
      invalidErrorMsg: "Please use a valid Subnet ",
    },

    networkGateway: {
      name: "networkGateway",
      label: "Network Gateway",
      invalidErrorMsg: "Please use a valid IP address ",
    },

    networkStart: {
      name: "networkStart",
      label: "Network Start",
      invalidErrorMsg: "Please use a valid IP address ",
    },

    //Master
    masterNodes: {
      name: "masterNodes",
      label: "Master Nodes",
      requiredErrorMsg: "Master Nodes is required",
      integerErrorMsg: "Master Node must be an integer",
      oddErrorMsg: "Master Nodes must be an odd number",
      maxErrorMsg: "Master Nodes quantity must be at most 20",
      minErrorMsg: "Master Nodes quantity must be at least 1",
    },

    masterCpus: {
      name: "masterCpus",
      label: " Master CPU",
      requiredErrorMsg: "Master CPU is required",
      integerErrorMsg: "Master CPU must be an integer",
      maxErrorMsg: "Master CPU quantity must be at most 64",
      minErrorMsg: "Master CPU quantity must be at least 1",
    },

    masterMem: {
      name: "masterMem",
      label: "Master Memory",
      requiredErrorMsg: "Master Memory is required",
      mBInvalidErrorMsg: "Memory must be a multiple of 1024",
      integerErrorMsg: "Memory must be an integer",
      maxErrorMsg: "Memory quantity must be at most 256",
      minErrorMsg: "Memory quantity must be at least 2",
    },

    masterDisk: {
      name: "masterDisk",
      label: "Master Disk",
      requiredErrorMsg: "Master Disk is required",
      integerErrorMsg: "Master Disk must be an integer",
      maxErrorMsg: "Master Disk quantity must be at most 256",
      minErrorMsg: "Master Disk quantity must be at least 10",
    },

    //Worker
    workerNodes: {
      name: "workerNodes",
      label: "Worker Nodes",
      requiredErrorMsg: "Worker Nodes is required",
      integerErrorMsg: "Worker Nodes must be an integer",
      maxErrorMsg: "Worker Nodes quantity must be at most 20",
      minErrorMsg: "Worker Nodes quantity must be at least 1",
    },

    workerCpus: {
      name: "workerCpus",
      label: "Worker CPU",
      requiredErrorMsg: "Worker CPU is required",
      integerErrorMsg: "Worker CPU must be an integer",
      maxErrorMsg: "Worker CPU quantity must be at most 64",
      minErrorMsg: "Worker CPU quantity must be at least 1",
    },

    workerMem: {
      name: "workerMem",
      label: "Worker Memory",
      requiredErrorMsg: "Worker Memory is required",
      integerErrorMsg: " Worker Memory must be an integer",
      maxErrorMsg: "Worker Memory quantity must be at most 1024",
      minErrorMsg: "Worker Memory quantity must be at least 2",
    },

    workerDisk: {
      name: "workerDisk",
      label: "Worker Disk",
      requiredErrorMsg: "Worker Disk is required",
      integerErrorMsg: "Worker Disk must be an integer",
      maxErrorMsg: "Worker Disk quantity must be at most 1024",
      minErrorMsg: "Worker Disk quantity must be at least 10",
    },

    //More Details
    resourcePool: {
      name: "resourcePool",
      label: "Resource Pool",
      requiredErrorMsg: "Resource Pool is required",
    },

    machineTemplate: {
      name: "machineTemplate",
      label: "Machine Template",
      requiredErrorMsg: "Machine Template is required",
    },

    storagePolicy: {
      name: "storagePolicy",
      label: "Storage Policy",
      requiredErrorMsg: "Storage Policy is required",
    },

    nameserver1: {
      name: "nameserver1",
      label: "Name Server 1",
      requiredErrorMsg: "Name Server 1 is required",
      invalidErrorMsg: "Please use a valid IP address ",
    },

    nameserver2: {
      name: "nameserver2",
      label: "Name Server 2",
      requiredErrorMsg: "Name Server 2 is required",
      invalidErrorMsg: "Please use a valid IP address ",
    },

    vCenterTlsThumbprint: {
      name: "vCenterTlsThumbprint",
      label: "vCenter TLS Thumbprint",
      requiredErrorMsg: "vCenter TLS Thumbprint is required",
      invalidErrorMsg:
        "vCenter TLS Thumbprint must be a valid hex string (e.g., AA:BB:CC:...)",
    },
  },
};
