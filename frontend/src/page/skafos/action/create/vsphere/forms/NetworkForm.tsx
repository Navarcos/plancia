import * as React from "react";
import Grid from "@mui/material/Grid";
import {Box, Checkbox, FormControlLabel, FormLabel} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import {ErrorMessage, Field, FieldProps, FormikProps} from "formik";
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

const NetworkForm = (props: {
    formField: {
        datacenter: any;
        datastore: any;
        datastoreUrl: any;
        network: any;
        sshAuthorizedKey: any;
        dhcp: any;
        folder: any;
        controlPlaneEndpointIP: any;
    };
}) => {
    const {
        formField: {
            datacenter,
            datastore,
            datastoreUrl,
            network,
            sshAuthorizedKey,
            dhcp,
            folder,
            controlPlaneEndpointIP,
        },
    } = props;

    return (
        <React.Fragment>
            <Box textAlign="center" mb={4}>
                <CustomTypography variant="h4" gutterBottom>
                    Network:
                </CustomTypography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Field
                        name={datacenter.name}
                        label={datacenter.label}
                        fullWidth
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={datastore.name}
                        label={datastore.label}
                        fullWidth
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={datastoreUrl.name}
                        label={datastoreUrl.label}
                        fullWidth
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={network.name}
                        label={network.label}
                        fullWidth
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={sshAuthorizedKey.name}
                        label={sshAuthorizedKey.label}
                        fullWidth
                        component={InputField}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <FormLabel component="legend">DHCP</FormLabel>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-around"
                        >
                            <Field name={dhcp.name}>
                                {({field, form}: FieldProps & { form: FormikProps<any> }) => (
                                    <>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    {...field}
                                                    checked={field.value === true}
                                                    onChange={() => form.setFieldValue(dhcp.name, true)}
                                                    color="primary"
                                                />
                                            }
                                            label="yes"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    {...field}
                                                    checked={field.value === false}
                                                    onChange={() => form.setFieldValue(dhcp.name, false)}
                                                    color="primary"
                                                />
                                            }
                                            label="no"
                                        />
                                    </>
                                )}
                            </Field>
                        </Box>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={folder.name}
                        label={folder.label}
                        fullWidth
                        component={InputField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Field
                        name={controlPlaneEndpointIP.name}
                        label={controlPlaneEndpointIP.label}
                        fullWidth
                        component={InputField}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default NetworkForm;
