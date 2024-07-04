import React from "react";
import { Container, Grid } from "@mui/material";
import { ErrorMessage, Field } from "formik";
import "../creationSuccess/kind-confirm-creation.css";
import "../formModel/KindFormModel";
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

const KindConfirmData = (props: { formField: any; values: any }) => {
  const { formField, values } = props;

  if (!formField || !values) {
    return <div>Loading...</div>;
  }

  const fieldSections = {
    Credentials: [
      formField.namespace,
      formField.name,
      formField.masterNodes,
      formField.workerNodes,
    ],
  };

  return (
    <Container className="kc-confirmation-container">
      <CustomTypography variant="h4" gutterBottom>
        Confirm Details:
      </CustomTypography>
      {Object.entries(fieldSections).map(([sectionTitle, fields]) => (
        <React.Fragment key={sectionTitle}>
          <CustomTypography
            className="kc-small-title"
            variant="h6"
            gutterBottom
          >
            {sectionTitle}
          </CustomTypography>
          <Grid
            container
            spacing={6}
            sx={{ marginTop: 2, justifyContent: "center" }}
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

export default KindConfirmData;
