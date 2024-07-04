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

const MasterForm = (props: {
    formField: {
        masterNodes: any;
        masterCpus: any;
        masterMem: any;
        masterDisk: any;
    };
}) => {
    const {
        formField: {masterNodes, masterCpus, masterMem, masterDisk},
    } = props;
    return (
        <React.Fragment>
            <Box textAlign="center" mb={4}>
                <CustomTypography variant="h4" gutterBottom>
                    Master Details:
                </CustomTypography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Field
                        name={masterNodes.name}
                        label={masterNodes.label}
                        type="number"
                        fullWidth
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={masterCpus.name}
                        label={masterCpus.label}
                        type="number"
                        fullWidth
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={masterMem.name}
                        label={masterMem.label}
                        type="number"
                        fullWidth
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={masterDisk.name}
                        label={masterDisk.label}
                        type="number"
                        fullWidth
                        component={InputField}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default MasterForm;
