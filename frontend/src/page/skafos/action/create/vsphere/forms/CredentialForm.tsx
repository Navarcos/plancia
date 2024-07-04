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

const CredentialsForm = (props: {
  formField: {
    namespace: any;
    name: any;
    kubernetesVersion: any;
    username: any;
    password: any;
    server: any;
  };
}) => {
  const {
    formField: {
      namespace,
      name,
      kubernetesVersion,
      username,
      password,
      server,
    },
  } = props;

  return (
    <React.Fragment>
      <Box textAlign="center" mb={4}>
        <CustomTypography variant="h4" gutterBottom>
          Main:
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
            name={username.name}
            label={username.label}
            fullWidth
            required
            component={InputField}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            name={password.name}
            label={password.label}
            type="password"
            fullWidth
            required
            component={InputField}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field
            name={server.name}
            label={server.label}
            fullWidth
            required
            component={InputField}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default CredentialsForm;
