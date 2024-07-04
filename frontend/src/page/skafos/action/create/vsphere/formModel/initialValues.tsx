import creationFormModel from "./creationFormModel";
import * as net from "node:net";

const {
  formField: {
    provider,

    //Credetials
    namespace,
    name,
    kubernetesVersion,
    username,
    password,
    server,

    //Network
    datacenter,
    datastore,
    datastoreUrl,
    network,
    sshAuthorizedKey,
    dhcp,
    folder,
    controlPlaneEndpointIP,

    //IP Pool (not required)
    networkEnd,
    networkSubnet,
    networkGateway,
    networkStart,

    //Master
    masterNodes,
    masterCpus,
    masterMem,
    masterDisk,

    //Worker
    workerNodes,
    workerCpus,
    workerMem,
    workerDisk,

    //More Details
    resourcePool,
    machineTemplate,
    storagePolicy,
    nameserver1,
    nameserver2,
    vCenterTlsThumbprint,
  },
} = creationFormModel;

export default {
  [provider.name]: "",
  [namespace.name]: "",
  [name.name]: "",
  [network.name]: "",
  [kubernetesVersion.name]: "",

  [username.name]: "",
  [password.name]: "",

  [server.name]: "",

  //Network
  [datacenter.name]: "",
  [datastore.name]: "",
  [datastoreUrl.name]: "",
  [network.name]: "",
  [sshAuthorizedKey.name]: "",
  [dhcp.name]: "",
  [folder.name]: "",
  [controlPlaneEndpointIP.name]: "",

  //IP Pool (not required)
  [networkEnd.name]: "",
  [networkSubnet.name]: "",
  [networkGateway.name]: "",
  [networkStart.name]: "",

  //Master
  [masterNodes.name]: "",
  [masterCpus.name]: "",
  [masterMem.name]: "",
  [masterDisk.name]: "",

  //Worker
  [workerNodes.name]: 0,
  [workerCpus.name]: 0,
  [workerMem.name]: 0,
  [workerDisk.name]: 0,

  //More Details
  [resourcePool.name]: "",
  [machineTemplate.name]: "",
  [storagePolicy.name]: "",
  [nameserver1.name]: "",
  [nameserver2.name]: "",
  [vCenterTlsThumbprint.name]: "",
};
