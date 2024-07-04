import React from "react";
import { Container, Grid } from "@mui/material";
import "../formModel/creationFormModel";
import { ErrorMessage, Field } from "formik";
import "./confirm-creation.css";
import { StyledInputField } from "../../../../../../style/StyledComponents";
import { CustomTypography } from "../../../../../../style/font/CustomTypography";

const InputField = ({ field, form, ...props }: any) => {
  return (
    <StyledInputField
      {...field}
      {...props}
      error={form.touched[field.name] && !!form.errors[field.name]}
      helperText={<ErrorMessage name={field.name} />}
    />
  );
};

const ConfirmData = (props: { formField: any; values: any }) => {
  const { formField, values } = props;

  const fieldSections = {
    Credentials: [
      formField.namespace,
      formField.name,
      formField.kubernetesVersion,
      formField.username,
      formField.password,
      formField.server,
    ],
    Network: [
      formField.datacenter,
      formField.datastore,
      formField.datastoreUrl,
      formField.network,
      formField.sshAuthorizedKey,
      formField.dhcp,
      formField.folder,
      formField.controlPlaneEndpointIP,
    ],
    "IP Pool": [
      formField.networkEnd,
      formField.networkSubnet,
      formField.networkGateway,
      formField.networkStart,
    ],
    "Master Details": [
      formField.masterNodes,
      formField.masterCpus,
      formField.masterMem,
      formField.masterDisk,
    ],
    "Worker Details": [
      formField.workerNodes,
      formField.workerCpus,
      formField.workerMem,
      formField.workerDisk,
    ],
    "More Details": [
      formField.resourcePool,
      formField.machineTemplate,
      formField.storagePolicy,
      formField.nameserver1,
      formField.nameserver2,
      formField.vCenterTlsThumbprint,
    ],
  };

  return (
    <Container className="confirmation-container">
      <CustomTypography variant="h4" gutterBottom>
        Confirm Details:
      </CustomTypography>
      {Object.entries(fieldSections).map(([sectionTitle, fields]) => (
        <React.Fragment key={sectionTitle}>
          <CustomTypography
            className="cc-small-title"
            variant="h6"
            gutterBottom
          >
            {sectionTitle}
          </CustomTypography>
          <Grid
            container
            spacing={3}
            sx={{ marginTop: 2, paddingBottom: 10, justifyContent: "center" }}
          >
            {fields.map((field) => (
              <Grid item xs={12} md={3} key={field.name}>
                <Field
                  name={field.name}
                  label={field.label}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={values[field.name]}
                  component={InputField}
                />
              </Grid>
            ))}
          </Grid>
        </React.Fragment>
      ))}
    </Container>
  );
};

export default ConfirmData;
