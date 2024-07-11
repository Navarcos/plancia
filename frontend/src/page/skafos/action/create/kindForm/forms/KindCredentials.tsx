import * as React from "react";
import Grid from "@mui/material/Grid";
import { ErrorMessage, Field } from "formik";
import Box from "@mui/material/Box";
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

const KindForm = (props: {
  formField: {
    namespace: any;
    name: any;
    workerNodes: any;
    masterNodes: any;
    kubernetesVersion: any;
  };
}) => {
  const {
    formField: { namespace, name, workerNodes, masterNodes, kubernetesVersion },
  } = props;

  return (
    <React.Fragment>
      <Box textAlign="center" mb={4}>
        <CustomTypography variant="h4" gutterBottom>
          Docker:
        </CustomTypography>
      </Box>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Field
            name={namespace.name}
            label={namespace.label}
            fullWidth
            required
            component={InputField}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            name={name.name}
            label={name.label}
            fullWidth
            required
            component={InputField}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
              name={kubernetesVersion.name}
              label={kubernetesVersion.label}
              fullWidth
              required
              component={InputField}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            name={masterNodes.name}
            label={masterNodes.label}
            type="number"
            fullWidth
            required
            component={InputField}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            name={workerNodes.name}
            label={workerNodes.label}
            type="number"
            fullWidth
            required
            component={InputField}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default KindForm;
