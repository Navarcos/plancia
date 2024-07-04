import { IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./more-options.css";

interface OptionsButtonProps {
  showDelete?: boolean;
  showView?: boolean;
  onDelete?: (row: any) => void;
  row: any;
}

const OptionsButton: React.FC<OptionsButtonProps> = ({
  showDelete = true,
  showView = true,
  onDelete,
  row,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (onDelete) {
      onDelete(row);
    }
    handleMenuClose();
  };

  return (
    <>
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {showDelete && (
          <MenuItem onClick={handleDeleteClick}>
            Delete <DeleteIcon className="dp-delete-icon" />
          </MenuItem>
        )}
        {showView && (
          <MenuItem onClick={handleMenuClose}>
            View <VisibilityIcon className="dp-view-icon" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default OptionsButton;
