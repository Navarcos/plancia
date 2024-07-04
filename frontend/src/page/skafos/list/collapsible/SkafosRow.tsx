import React, {useEffect, useState} from "react";
import {getColor, getTooltip, SkafosListItemResponse, SkafosStats,} from "../../../../model/vsphere/skafos";
import "./collapsible-element.css";
import {useNavigate} from "react-router-dom";
import {SkafosApi} from "../../../../service/skafosApi";
import {Box, Collapse, IconButton, TableCell, TableRow, Tooltip,} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {Circle} from "@mui/icons-material";
import ProgressArc from "../../../../shared/component/progressArc/ProgressArc";
import {StyledTableRow} from "./CollapsibleElementStyle";

const SkafosRow: React.FC<{
    row: SkafosListItemResponse;
    allOpen: boolean;
    isSmallScreen: boolean;
}> = ({row, allOpen, isSmallScreen}) => {
    const [open, setOpen] = useState(allOpen);
    const [detail, setDetail] = useState<SkafosStats>();
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

    const handleNavigate = (
        namespace: string,
        name: string,
        provider: string
    ) => {
        navigate("/skafos/" + namespace + "/" + name + "/" + provider);
    };

    const handleIconButtonClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setOpen(!open);
    };

    function phaseClass(phase: string | undefined) {
        switch (phase) {
            case "Failed": return "phase-failed";
            case "Provisioned": return "";
            default: return "phase-warning";
        }
    }

    return (
        <>
            <StyledTableRow
                className="ce-styled-table-row"
                sx={{cursor: "pointer"}}
                onClick={() => handleNavigate(row.namespace, row.name, row.provider)}
            >
                <TableCell padding={"none"}>
                    <IconButton
                        className="ce-collapse-icon-button"
                        style={{marginLeft: 30}}
                        aria-label="expand row"
                        size="small"
                        onClick={handleIconButtonClick}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>

                {!isSmallScreen && (
                    <TableCell padding={"none"}>
                        <Tooltip title={getTooltip(row?.status)}>
                            <IconButton>
                                <Circle
                                    fontSize={"small"}
                                    color={getColor(row.status)}
                                ></Circle>
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                )}
                <TableCell className={phaseClass(row?.status.phase)} component="th" scope="row">
                    {row?.status.phase}
                </TableCell>
                <TableCell component="th" scope="row">
                    {row?.name}
                </TableCell>
                {!isSmallScreen && <TableCell>{row?.namespace}</TableCell>}
                <TableCell>{row?.provider}</TableCell>
                <TableCell>{row?.kubernetesVersion}</TableCell>
                <TableCell>{row?.masterNodes}</TableCell>
                <TableCell>{row?.workerNodes}</TableCell>
            </StyledTableRow>
            <TableRow>
                <TableCell className="ce-progress-arc-cell" colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box
                            className="ce-progress-arc-box"
                            sx={{
                                flexDirection: isSmallScreen ? "column" : "row",
                            }}
                        >
                            <ProgressArc resource={"Pods"} stats={detail?.pods}></ProgressArc>
                            <ProgressArc
                                resource={"Deployments"}
                                stats={detail?.deployments}
                            ></ProgressArc>
                            <ProgressArc
                                resource={"ReplicaSets"}
                                stats={detail?.replicasets}
                            ></ProgressArc>
                            <ProgressArc
                                resource={"StatefulSets"}
                                stats={detail?.statefulsets}
                            ></ProgressArc>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default SkafosRow;
