import React, {useState} from "react";
import {Box, Container, Grid, Step, ThemeProvider,} from "@mui/material";
import {Form, Formik} from "formik";
import initialValues from "./formModel/initialValues";
import creationFormModel from "./formModel/creationFormModel";
import validationSchema from "./formModel/validationSchema";
import "./creation-page.css";
import CredentialsForm from "./forms/CredentialForm";
import NetworkForm from "./forms/NetworkForm";
import IpPoolForm from "./forms/IpPoolForm";
import MasterForm from "./forms/MasterForm";
import WorkerForm from "./forms/WorkerForm";
import MoreDetailsForm from "./forms/MoreDetailsForm";
import ConfirmData from "./creationSuccess/ConfirmCreation";
import CreationSuccess from "./creationSuccess/CreationSuccess";
import {ButtonWithHover, StepLabelStyled, StepperContainer,} from "../CreationStyle";
import {useNavigate, useParams} from "react-router-dom";
import {VSphereApi} from "../../../../../service/vsphereApi";
import AnimatedContainer from "../../../../../style/Animation";
import DashboardLayout from "../../../../../style/DashboardLayout";
import {parseCreationRequest, VSphereCreationRequest,} from "../../../../../model/vsphere/vsphere/skafos";
import "../../../../../style/responsiveTheme/customTheme";
import theme from "../../../../../style/responsiveTheme/customTheme";

const steps = [
    "vSphere",
    "Network",
    "IP Pool",
    "Master Details",
    "Worker Details",
    "More Details",
    "Confirm Data",
];

const {formId, formField} = creationFormModel;

function _renderStepContent(step: number, values: any) {
    switch (step) {
        case 0:
            return <CredentialsForm formField={formField}/>;
        case 1:
            return <NetworkForm formField={formField}/>;
        case 2:
            return <IpPoolForm formField={formField}/>;
        case 3:
            return <MasterForm formField={formField}/>;
        case 4:
            return <WorkerForm formField={formField}/>;
        case 5:
            return <MoreDetailsForm formField={formField}/>;
        case 6:
            return <ConfirmData formField={formField} values={values}/>;
        default:
            return <Box>Not Found</Box>;
    }
}

export default function CreationPage() {
    const [activeStep, setActiveStep] = useState(0);
    const isLastStep = activeStep === steps.length - 1;
    const currentValidationSchema = validationSchema[activeStep];
    const [transition, setTransition] = useState("0");

    const {provider} = useParams<{ provider: string }>();
    const navigate = useNavigate();

    function _sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function _submitForm(values: VSphereCreationRequest, actions: any) {
        Promise.resolve(VSphereApi.post(values)).then((res) => {
            actions.setSubmitting(false);
            setActiveStep(activeStep + 1);
        });
    }

    function _handleSubmit(values: any, actions: any) {
        if (isLastStep) {
            _submitForm(parseCreationRequest(values), actions)
                .catch((err) => {
                    navigate("/");
                })
                .then((r) => {
                    navigate("/");
                });
        } else {
            actions.setTouched({});
            actions.setSubmitting(false);
            setTransition("1");
            setTimeout(() => {
                setActiveStep(activeStep + 1);
                setTransition("2");
            }, 300);
        }
    }

    function _handleBack() {
        setTransition("3");
        setTimeout(() => {
            setTransition("4");
            setActiveStep(activeStep - 1);
        }, 300);
    }

    return (
        <ThemeProvider theme={theme}>
            <DashboardLayout>
                <AnimatedContainer>
                    <Container className="container center-container">
                        <Grid
                            className="cp-grid"
                            container
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid item xs={12} sm={3}>
                                <StepperContainer
                                    activeStep={activeStep}
                                    orientation="vertical"
                                    className="stepper"
                                >
                                    {steps.map((label, index) => (
                                        <Step key={label} className="step-colors">
                                            <StepLabelStyled>{label}</StepLabelStyled>
                                        </Step>
                                    ))}
                                </StepperContainer>
                            </Grid>

                            <Grid item xs={12} sm={9} className="cp-fields-grid">
                                <Box marginBottom="20px" className={`swipe-${transition}`}>
                                    {activeStep === steps.length ? (
                                        <CreationSuccess/>
                                    ) : (
                                        <Formik
                                            initialValues={initialValues}
                                            validationSchema={currentValidationSchema}
                                            onSubmit={_handleSubmit}
                                        >
                                            {({isSubmitting, values}) => (
                                                <Form id={formId}>
                                                    {_renderStepContent(activeStep, values)}
                                                    <Box
                                                        className="cpage-button-box"
                                                        sx={(theme) => ({
                                                            marginTop: {
                                                                xs: isLastStep ? "50vh" : "30vh",
                                                                sm: isLastStep ? "130vh" : "20vh",
                                                                xl: isLastStep ? "90vh" : "20vh",
                                                            },
                                                        })}
                                                    >
                                                        {activeStep !== 0 && (
                                                            <ButtonWithHover
                                                                className="cpage-button"
                                                                onClick={_handleBack}
                                                            >
                                                                Back
                                                            </ButtonWithHover>
                                                        )}
                                                        <ButtonWithHover
                                                            disabled={isSubmitting}
                                                            type="submit"
                                                        >
                                                            {isLastStep ? "Create" : "Next"}
                                                        </ButtonWithHover>
                                                    </Box>
                                                </Form>
                                            )}
                                        </Formik>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </AnimatedContainer>
            </DashboardLayout>
        </ThemeProvider>
    );
}
