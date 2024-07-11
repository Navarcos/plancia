import * as Yup from "yup";
import creationFormModel from "./creationFormModel";

const {
  formField: {
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

export default [
  //Credentials
  Yup.object().shape({
    [namespace.name]: Yup.string().required(`${name.requiredErrorMsg}`)
        .matches(/^[a-z]+$/, `${namespace.lowerCaseMsg}`),
    [name.name]: Yup.string().required(`${name.requiredErrorMsg}`)
        .matches(/^[a-z]+$/, `${name.lowerCaseMsg}`),
    [kubernetesVersion.name]: Yup.string()
      .required(`${kubernetesVersion.requiredErrorMsg}`)
      .matches(/^(v)?\d+\.\d+\.\d+$/, `${kubernetesVersion.invalidErrorMsg}`),
    [username.name]: Yup.string().required(`${username.requiredErrorMsg}`),
    [password.name]: Yup.string()
      .required(`${password.requiredErrorMsg}`)
      .min(8, `${password.invalidMinLenghtErrorMsg}`),
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      //   `${password.invalidCharsErrorMsg}`
      // ),
    [server.name]: Yup.string()
      .required(`${server.requiredErrorMsg}`)
      .matches(
        /^(https?:\/\/)?([\w\d.-]+)\.([\w]{2,})([\w\d.\/?=&#%_-]*)?$/i,
        `${server.invalidErrorMsg}`
      ),
  }),
  //Network
  Yup.object().shape({
    [datacenter.name]: Yup.string().required(`${datacenter.requiredErrorMsg}`),
    [datastore.name]: Yup.string().required(`${datastore.requiredErrorMsg}`),
    [datastoreUrl.name]: Yup.string().required(
      `${datastoreUrl.requiredErrorMsg}`
    ),
    // .matches(
    //     /^(https?:\/\/)?([\w\d.-]+)\.([\w]{2,})([\w\d.\/?=&#%_-]*)?$/i,
    //     `${datastoreUrl.invalidErrorMsg}`
    // ),
    [network.name]: Yup.string().required(`${network.requiredErrorMsg}`),
    [sshAuthorizedKey.name]: Yup.string().required(
      `${sshAuthorizedKey.requiredErrorMsg}`
    ),
    // .matches(
    //   /^ssh-rsa\s+[A-Za-z0-9+/]+[=]{0,3}(?:\s+[^\s]+)?$/,
    //   `${sshAuthorizedKey.invalidErrorMsg}`
    // ),
    [dhcp.name]: Yup.boolean().required(`${dhcp.requiredErrorMsg}`),
    [folder.name]: Yup.string().required(`${folder.requiredErrorMsg}`),
    [controlPlaneEndpointIP.name]: Yup.string()
      .required(`${controlPlaneEndpointIP.requiredErrorMsg}`)
      .matches(
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
        {
          message: `${controlPlaneEndpointIP.invalidErrorMsg}`,
          excludeEmptyString: true,
        }
      )
      .test("ip", `${controlPlaneEndpointIP.invalidErrorMsg}`, (value) => {
        if (!value) return true;
        return value.split(".").every((i) => parseInt(i, 10) <= 255);
      }),
  }),
  //IP Pool (Not Required)
  Yup.object().shape({
    [networkEnd.name]: Yup.string()
      .matches(
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
        {
          message: `${networkEnd.invalidErrorMsg}`,
          excludeEmptyString: true,
        }
      )
      .test("ip", `${networkEnd.invalidErrorMsg}`, (value) => {
        if (!value) return true;
        return value.split(".").every((i) => parseInt(i, 10) <= 255);
      }),
    [networkSubnet.name]: Yup.string(),
    [networkGateway.name]: Yup.string()
      .matches(
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
        {
          message: `${networkGateway.invalidErrorMsg}`,
          excludeEmptyString: true,
        }
      )
      .test("ip", `${networkGateway.invalidErrorMsg}`, (value) => {
        if (!value) return true;
        return value.split(".").every((i) => parseInt(i, 10) <= 255);
      }),
    [networkStart.name]: Yup.string()
      .matches(
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
        {
          message: `${networkStart.invalidErrorMsg}`,
          excludeEmptyString: true,
        }
      )
      .test("ip", `${networkStart.invalidErrorMsg}`, (value) => {
        if (!value) return true;
        return value.split(".").every((i) => parseInt(i, 10) <= 255);
      }),
  }),
  //Master
  Yup.object().shape({
    [masterNodes.name]: Yup.number()
      .required(`${masterNodes.requiredErrorMsg}`)
      .integer(`${masterNodes.integerErrorMsg}`)
      .min(1, `${masterNodes.minErrorMsg}`)
      .max(20, `${masterNodes.maxErrorMsg}`)
      .test("is-odd", `${masterNodes.oddErrorMsg}`, (value) => value % 2 === 1),
    [masterCpus.name]: Yup.number()
      .required(`${masterCpus.requiredErrorMsg}`)
      .integer(`${masterCpus.integerErrorMsg}`)
      .min(1, `${masterCpus.minErrorMsg}`)
      .max(64, `${masterCpus.maxErrorMsg}`),
    [masterMem.name]: Yup.number()
      .required(`${masterMem.requiredErrorMsg}`)
      .integer(`${masterMem.integerErrorMsg}`)
      .min(2, `${masterMem.minErrorMsg}`)
      .max(256, `${masterMem.maxErrorMsg}`),
    [masterDisk.name]: Yup.number()
      .required(`${masterDisk.requiredErrorMsg}`)
      .integer(`${masterDisk.integerErrorMsg}`)
      .min(10, `${masterDisk.minErrorMsg}`)
      .max(256, `${masterDisk.maxErrorMsg}`),
  }),
  //Worker
  Yup.object().shape({
    [workerNodes.name]: Yup.number()
      .required(`${workerNodes.requiredErrorMsg}`)
      .integer(`${workerNodes.integerErrorMsg}`)
      .min(1, `${workerNodes.minErrorMsg}`)
      .max(20, `${workerNodes.maxErrorMsg}`),
    [workerCpus.name]: Yup.number()
      .required(`${workerCpus.requiredErrorMsg}`)
      .integer(`${workerCpus.integerErrorMsg}`)
      .min(1, `${workerCpus.minErrorMsg}`)
      .max(64, `${workerCpus.maxErrorMsg}`),
    [workerMem.name]: Yup.number()
      .required(`${workerMem.requiredErrorMsg}`)
      .integer(`${workerMem.integerErrorMsg}`)
      .min(2, `${workerMem.minErrorMsg}`)
      .max(1024, `${workerMem.maxErrorMsg}`),
    [workerDisk.name]: Yup.number()
      .required(`${workerDisk.requiredErrorMsg}`)
      .integer(`${workerDisk.integerErrorMsg}`)
      .min(10, `${workerDisk.minErrorMsg}`)
      .max(1024, `${workerDisk.maxErrorMsg}`),
  }),
  //More Details
  Yup.object().shape({
    [resourcePool.name]: Yup.string().required(
      `${resourcePool.requiredErrorMsg}`
    ),
    [machineTemplate.name]: Yup.string().required(
      `${machineTemplate.requiredErrorMsg}`
    ),
    [nameserver1.name]: Yup.string()
      .required(`${nameserver1.requiredErrorMsg}`)
      .matches(
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
        {
          message: `${nameserver1.invalidErrorMsg}`,
          excludeEmptyString: true,
        }
      )
      .test("ip", `${nameserver1.invalidErrorMsg}`, (value) => {
        if (!value) return true;
        return value.split(".").every((i) => parseInt(i, 10) <= 255);
      }),
    [nameserver2.name]: Yup.string()
      .required(`${nameserver2.requiredErrorMsg}`)
      .matches(
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
        {
          message: `${nameserver2.invalidErrorMsg}`,
          excludeEmptyString: true,
        }
      )
      .test("ip", `${nameserver2.invalidErrorMsg}`, (value) => {
        if (!value) return true;
        return value.split(".").every((i) => parseInt(i, 10) <= 255);
      }),
    [vCenterTlsThumbprint.name]: Yup.string()
      .required(`${vCenterTlsThumbprint.requiredErrorMsg}`)
      .matches(
        /^([a-fA-F0-9]{2}:){15}[a-fA-F0-9]{2}$|^([a-fA-F0-9]{2}:){19}[a-fA-F0-9]{2}$|^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$/,
        `${vCenterTlsThumbprint.invalidErrorMsg}`
      ),
  }),
];
