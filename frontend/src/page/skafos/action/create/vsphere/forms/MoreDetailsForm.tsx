import * as React from "react";
import Grid from "@mui/material/Grid";
import {ErrorMessage, Field} from "formik";
import Box from "@mui/material/Box";
import {StyledInputField} from "../../../../../../style/StyledComponents";
import {CustomTypography} from "../../../../../../style/font/CustomTypography";

const InputField = ({field, form, ...props}: any) => {
    return (
        <StyledInputField
            {...field}
            {...props}
            error={form.touched[field.name] && !!form.errors[field.name]}
            helperText={<ErrorMessage name={field.name}/>}
        />
    );
};

const MoreDetailsForm = (props: {
    formField: {
        resourcePool: any;
        machineTemplate: any;
        storagePolicy: any;
        nameserver1: any;
        nameserver2: any;
        vCenterTlsThumbprint: any;
    };
}) => {
    const {
        formField: {
            resourcePool,
            machineTemplate,
            storagePolicy,
            nameserver1,
            nameserver2,
            vCenterTlsThumbprint,
        },
    } = props;
    return (
        <React.Fragment>
            <Box textAlign="center" mb={4}>
                <CustomTypography variant="h4" gutterBottom>
                    Final Details:
                </CustomTypography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Field
                        name={resourcePool.name}
                        label={resourcePool.label}
                        fullWidth
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={machineTemplate.name}
                        label={machineTemplate.label}
                        fullWidth
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={storagePolicy.name}
                        label={storagePolicy.label}
                        fullWidth
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={nameserver1.name}
                        label={nameserver1.label}
                        fullWidth
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={nameserver2.name}
                        label={nameserver2.label}
                        fullWidth
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={vCenterTlsThumbprint.name}
                        label={vCenterTlsThumbprint.label}
                        fullWidth
                        component={InputField}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default MoreDetailsForm;
