import styled from "@emotion/styled";
import TableRow from "@mui/material/TableRow";
import teal from "@mui/material/colors/teal";

export const customTeal = teal[50];

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "white",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "white",
  },
  "&:hover": {
    backgroundColor: "rgb(152, 161, 152, 0.607)",
  },
  "& > *": {
    borderBottom: "unset",
  },
}));
