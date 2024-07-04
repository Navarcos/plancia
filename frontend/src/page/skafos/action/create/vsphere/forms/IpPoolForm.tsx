import * as React from "react";
import Grid from "@mui/material/Grid";
import { StyledInputField } from "../../../../../../style/StyledComponents";
import { ErrorMessage, Field } from "formik";
import Box from "@mui/material/Box";
import {CustomTypography} from "../../../../../../style/font/CustomTypography";

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

const IpPoolForm = (props: {
  formField: {
    networkSubnet: any;
    networkGateway: any;
    networkStart: any;
    networkEnd: any;
  };
}) => {
  const {
    formField: { networkSubnet, networkGateway, networkStart, networkEnd },
  } = props;
  return (
    <React.Fragment>
      <Box textAlign="center" mb={4}>
        <CustomTypography variant="h4" gutterBottom>
          IP Pool:
        </CustomTypography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Field
            name={networkSubnet.name}
            label={networkSubnet.label}
            fullWidth
            component={InputField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field
            name={networkGateway.name}
            label={networkGateway.label}
            fullWidth
            component={InputField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field
            name={networkStart.name}
            label={networkStart.label}
            fullWidth
            component={InputField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field
              name={networkEnd.name}
              label={networkEnd.label}
              fullWidth
              component={InputField}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default IpPoolForm;
