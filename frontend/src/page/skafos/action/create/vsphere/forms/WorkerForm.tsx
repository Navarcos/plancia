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

const WorkerForm = (props: {
    formField: {
        workerNodes: any;
        workerCpus: any;
        workerMem: any;
        workerDisk: any;
    };
}) => {
    const {
        formField: {workerNodes, workerCpus, workerMem, workerDisk},
    } = props;
    return (
        <React.Fragment>
            <Box textAlign="center" mb={4}>
                <CustomTypography variant="h4" gutterBottom>
                    Worker Details:
                </CustomTypography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Field
                        name={workerNodes.name}
                        label={workerNodes.label}
                        type="number"
                        fullWidth
                        required
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={workerCpus.name}
                        label={workerCpus.label}
                        fullWidth
                        type="number"
                        required
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={workerMem.name}
                        label={workerMem.label}
                        type="number"
                        fullWidth
                        required
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={workerDisk.name}
                        label={workerDisk.label}
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

export default WorkerForm;
