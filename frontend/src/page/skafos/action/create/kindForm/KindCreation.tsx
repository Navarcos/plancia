import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Step,
  ThemeProvider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import AnimatedContainer from "../../../../../style/Animation";
import DashboardLayout from "../../../../../style/DashboardLayout";
import {
  StepperContainer,
  StepLabelStyled,
  ButtonWithHover,
} from "../CreationStyle";
import "./kind-creation.css";
import CreationSuccess from "../vsphere/creationSuccess/CreationSuccess";

import KindForm from "./forms/KindCredentials";
import KindConfirmData from "./creationSuccess/KindConfirmCreation";
import kindFormModel from "./formModel/KindFormModel";
import KindValidationSchema from "./formModel/KindValidationSchema";
import theme from "../../../../../style/responsiveTheme/customTheme";
import KindInitialValues from "./formModel/KindInitialValues";
import KindFormModel from "./formModel/KindFormModel";
import { DockerApi } from "../../../../../service/dockerApi";
import {
  KindCreationRequest,
  parseCreationRequest,
} from "../../../../../model/kind/kind";

const steps = ["Docker", "Confirm Data"];

const { formId, formField } = KindFormModel;

function _renderStepContent(step: number, values: any) {
  console.log("Render step:", step, values, formField);

  switch (step) {
    case 0:
      return <KindForm formField={formField} />;
    case 1:
      return <KindConfirmData formField={formField} values={values} />;
    default:
      return <Box>Not Found</Box>;
  }
}

export default function KindCreation() {
  const [activeStep, setActiveStep] = useState(0);
  const isLastStep = activeStep === steps.length - 1;
  const kindValidationSchema = KindValidationSchema[activeStep];
  const [transition, setTransition] = useState("0");

  const { provider } = useParams<{ provider: string }>();
  const navigate = useNavigate();

  function _sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function _submitForm(values: KindCreationRequest, actions: any) {
    Promise.resolve(DockerApi.post(values)).then((res) => {
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
          <Container className="kc-container center-container">
            <Grid
              className="kc-grid"
              container
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12} sm={3}>
                <StepperContainer
                  activeStep={activeStep}
                  orientation="vertical"
                  className="kc-stepper"
                >
                  {steps.map((label, index) => (
                    <Step key={label} className="step-colors">
                      <StepLabelStyled>{label}</StepLabelStyled>
                    </Step>
                  ))}
                </StepperContainer>
              </Grid>

              <Grid item xs={12} sm={9} className="kc-fields-grid">
                <Box marginBottom="20px" className={`swipe-${transition}`}>
                  {activeStep === steps.length ? (
                    <CreationSuccess />
                  ) : (
                    <Formik
                      initialValues={KindInitialValues}
                      validationSchema={kindValidationSchema}
                      onSubmit={_handleSubmit}
                    >
                      {({ isSubmitting, values }) => (
                        <Form id={formId}>
                          {_renderStepContent(activeStep, values)}
                          <Box
                            className="kc-button-box"
                            sx={(theme) => ({
                              marginTop: {
                                xs: isLastStep ? "50vh" : "30vh",
                                sm: isLastStep ? "20px" : "20vh",
                              },
                            })}
                          >
                            {activeStep !== 0 && (
                              <ButtonWithHover
                                className="kc-button"
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
