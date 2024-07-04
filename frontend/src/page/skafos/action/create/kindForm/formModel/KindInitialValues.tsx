import * as net from "node:net";
import KindFormModel from "./KindFormModel";

const {
  formField: { provider,
    namespace,
    name,
    workerNodes,
    masterNodes ,
    kubernetesVersion,
  },
} = KindFormModel;

export default {
  [provider.name]: "",
  [namespace.name]: "",
  [name.name]: "",
  [workerNodes.name]: "",
  [masterNodes.name]: "",
  [kubernetesVersion.name]: "",
};
