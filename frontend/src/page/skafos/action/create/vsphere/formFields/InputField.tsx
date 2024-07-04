import { useField } from "formik";
import React from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { at } from "lodash";
import { VisibilityOff, Visibility } from "@mui/icons-material";

const InputField = (props: any) => {
  const { errorText, type = "text", ...rest } = props;
  const [field, meta] = useField(props);
  const isPassword =
    rest.name === "password" || rest.name === "confirmPassword";
  const [showPassword, setShowPassword] = React.useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function _renderHelperText() {
    const [touched, error] = at(meta, "touched", "error");
    if (touched && error) {
      return error;
    }
  }

  return (
    <TextField
      type={isPassword ? (showPassword ? "text" : "password") : type}
      error={meta.touched && meta.error && true}
      helperText={_renderHelperText()}
      {...field}
      {...rest}
      InputProps={
        isPassword
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : undefined
      }
    />
  );
};

export default InputField;
