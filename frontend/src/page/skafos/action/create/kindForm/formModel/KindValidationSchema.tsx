import * as Yup from "yup";
import KindFormModel from "./KindFormModel";

const {
  formField: { namespace, name, masterNodes, workerNodes, kubernetesVersion },
} = KindFormModel;

export default [
  Yup.object().shape({
    [namespace.name]: Yup.string().required(`${name.requiredErrorMsg}`),
    [name.name]: Yup.string().required(`${name.requiredErrorMsg}`),
    [masterNodes.name]: Yup.number()
      .required(`${masterNodes.requiredErrorMsg}`)
      .integer(`${masterNodes.integerErrorMsg}`)
      .min(1, `${masterNodes.minErrorMsg}`)
      .max(10, `${masterNodes.maxErrorMsg}`)
      .test("is-odd", `${masterNodes.oddErrorMsg}`, (value) => value % 2 === 1),

    [workerNodes.name]: Yup.number()
      .required(`${workerNodes.requiredErrorMsg}`)
      .integer(`${workerNodes.integerErrorMsg}`)
      .min(1, `${workerNodes.minErrorMsg}`)
      .max(10, `${workerNodes.maxErrorMsg}`),
    [kubernetesVersion.name]: Yup.string()
      .required(`${kubernetesVersion.requiredErrorMsg}`)
      .matches(/^(v)?\d+\.\d+\.\d+$/, `${kubernetesVersion.invalidErrorMsg}`),
  }),
];
