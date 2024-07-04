import { Button, Stepper, StepLabel, StepIconProps, Box } from "@mui/material";
import styled from "@emotion/styled";
import { FunctionComponent } from "react";

export const CustomStepIcon: FunctionComponent<StepIconProps> = ({
  active,
  completed,
}) => {
  return (
    <Box
      style={{
        width: "20px",
        height: "20px",
        background: "linear-gradient(45deg, #9DB4D1 30%, #5EECBA 90%)",
        borderRadius: "50%",
      }}
    />
  );
};

export const ButtonWithHover = styled(Button)({
  background: "black",
  border: 0,
  borderRadius: 3,
  color: "white",
  height: 48,
  padding: "0 30px",
  "&:hover": {
    backgroundColor: "#9DB4D1",
  },
});

export const StepperContainer = styled(Stepper)({
  background: "transparent",
});

export const StepLabelStyled = styled(StepLabel)({
  "& .MuiStepLabel-label": {
    color: "black",
    "&.Mui-active": {
      color: "grey",
    },
    "&.Mui-completed": {
      color: "black",
    },
  },
});
