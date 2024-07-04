import Select from "@mui/material/Select";
import styled from "@emotion/styled";
import { TextField } from "@mui/material";

export const StyledInputField = styled(TextField)`
  & .MuiOutlinedInput-root {
    & fieldset {
      background: 0;
      border: 0 grey;
      outline: none;
      border: none;
      border-bottom: grey 1px solid;

      &:focus {
        padding-bottom: 5px;
        border-bottom: 2px solid #1976d2;
      }
    }

    &:hover fieldset {
      border-bottom: 2px solid #1976d2;
    }

    &.Mui-focused fieldset {
      border-bottom: 2px solid #1976d2;
    }

    &.Mui-error fieldset {
      border-bottom: 1px solid red;
    }

    & input {
      color: grey;
    }
  }

  & .MuiInputLabel-root {
    color: grey;
  }

  & .Mui-error .MuiInputLabel-root {
    color: red;
  }

  & .MuiFormHelperText-root {
    color: grey;
  }

  & .Mui-error .MuiFormHelperText-root {
    color: red;
  }
`;

export const StyledSelect = styled(Select)`
  & .MuiSelect-select {
    background: 0;
    border: 0 grey;
    outline: none;
    border: none;
    border-bottom: grey 1px solid;

    &:focus {
      border-bottom: 2px solid #1976d2;
    }
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none;
    & fieldset {
      border: none !important;
    }
  }

  & .MuiOutlinedInput-root {
    & fieldset {
      background: 0;
      border: 0 grey;
      outline: none;
      border: none !important;
      border-bottom: grey 1px solid;

      &:focus {
        border-bottom: 2px solid #1976d2;
      }
    }

    &:hover fieldset {
      border-bottom: 2px solid #1976d2;
    }

    &.Mui-focused fieldset {
      border-bottom: 2px solid #1976d2;
    }

    &.Mui-error fieldset {
      border-bottom: 1px solid red;
    }

    & input {
      color: grey;
    }
  }

  & .MuiInputLabel-root {
    color: grey;
  }

  & .Mui-error .MuiInputLabel-root {
    color: red;
  }

  & .MuiFormHelperText-root {
    color: grey;
  }

  & .Mui-error .MuiFormHelperText-root {
    color: red;
  }
`;
