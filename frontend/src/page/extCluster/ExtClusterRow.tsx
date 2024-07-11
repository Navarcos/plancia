import React, { useEffect, useState } from "react";
import "../skafos/list/collapsible/collapsible-element.css";
import { useNavigate } from "react-router-dom";
import { IconButton, TableCell } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { StyledTableRow } from "../skafos/detail/SharedTableStyle";
import { SkafosApi } from "../../service/skafosApi";

const ExtClusterRow: React.FC<{
  row: any;
  allOpen: boolean;
  isSmallScreen: boolean;
}> = ({ row, allOpen, isSmallScreen }) => {
  const [open, setOpen] = useState(allOpen);
  const [detail, setDetail] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      return;
    }
    SkafosApi.getSkafosStats(row.namespace, row.name)
      .then((result) => setDetail(result))
      .catch((error) => {
        console.log(error);
      });
  }, [row, open]);

  useEffect(() => {
    setOpen(allOpen);
  }, [allOpen]);

  const handleNavigate = () => {
    navigate("");
  };

  const handleIconButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpen(!open);
  };

  return (
    <>
      <StyledTableRow
        className="ce-styled-table-row"
        sx={{ cursor: "pointer" }}
        // onClick={() => handleNavigate(row.namespace, row.name, row.provider)}
      >

      </StyledTableRow>
    </>
  );
};

export default ExtClusterRow;
