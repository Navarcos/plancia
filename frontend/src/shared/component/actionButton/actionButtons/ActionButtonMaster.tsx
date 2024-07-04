import {IconButton, Menu, MenuItem} from "@mui/material";
import React, {useState} from "react";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import EditIcon from "@mui/icons-material/Edit";
import "../actionButtons/action-button.css";
import ControlPlaneNodesModal from "../scaleModal/ControlPlaneNodesModal";
import {SkafosApi} from "../../../../service/skafosApi";


const ActionButtonMaster: React.FC<{
    namespace: string;
    name: string;
    nodes: number;
}> = ({
          namespace,
          name,
          nodes
      }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [masterModalOpen, setMasterModalOpen] = useState<boolean>(false);
    const [masterNodes, setMasterNodes] = useState<number>(nodes);


    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleScaleMaster = () => {
        setMasterModalOpen(true);
        handleMenuClose();
    };

    const handleMasterNodesChange = (value: number) => {
        const newValue = Math.max(1, value);
        Promise.resolve(SkafosApi.patchKubeadm(namespace, name, nodes))
            .then(() => setMasterNodes(newValue))
            .catch(error => console.log(error));
    };

    return (
        <>
            <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
            >
                <DesignServicesIcon/>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleScaleMaster}>
                    Scale <EditIcon className="scaleIcon"/>
                </MenuItem>
            </Menu>

            <ControlPlaneNodesModal
                open={masterModalOpen}
                onClose={() => setMasterModalOpen(false)}
                masterNodes={masterNodes}
                onMasterNodesChange={handleMasterNodesChange}
            />
        </>
    );
};

export default ActionButtonMaster;
