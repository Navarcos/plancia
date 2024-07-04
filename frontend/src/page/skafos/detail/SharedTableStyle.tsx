import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/system";

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.background.default,
  },
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.background.default,
  },
  "&:hover": {
    backgroundColor: "rgba(152, 161, 152, 0.607)",
  },
  "& > *": {
    borderBottom: "unset",
  },
}));
