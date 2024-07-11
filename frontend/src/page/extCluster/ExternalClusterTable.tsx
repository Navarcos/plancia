import React, {useEffect, useState} from "react";
import {
    Box,
    Container,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import "../../../../index.css";
import "./ext-clusters.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoIcon from "@mui/icons-material/Info";
import {motion} from "framer-motion";
import {CustomTypography} from "../../style/font/CustomTypography";
import {shakeAnimation} from "../skafos/list/grid/AnimationList";
import {ExtClusterApi} from "../../service/extClusterApi";
import ExtClusterRow from "./ExtClusterRow";

const ExtClusterTable: React.FC = () => {
    const isSmallScreen = useMediaQuery("(max-width:600px)");
    const [allOpen, setAllOpen] = useState(true);
    const [open, setOpen] = useState(true);
    const [rows, setRows] = useState<any>([])

    const renderTable = rows.length > 0;

    function fetchData() {
        ExtClusterApi.getExternalClusters()
            .then((result) => setRows(result))
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    const toggleAllOpen = () => {
        setAllOpen(!allOpen);
    };

    const handleIconButtonClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setOpen(!open);
    };

    return (
        <Container maxWidth={false}>
            {renderTable && (
                <Box className="ext-list-title-box">
                    <Paper className="ext-list-title-paper">
                        <CustomTypography variant="h6">External Clusters</CustomTypography>
                        <motion.div {...shakeAnimation}>
                            <Tooltip title="Click on row to be directed to selected cluster overview.">
                                <IconButton size="small">
                                    <InfoIcon className="ext-list-st-icon"/>
                                </IconButton>
                            </Tooltip>
                        </motion.div>
                    </Paper>

                    <TableContainer
                        component={Paper}
                        className="ext-list-table-container"
                    >
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="ext-list-table-cell-collapse">
                                        <IconButton
                                            className="ext-list-icon-collapse"
                                            aria-label="expand all rows"
                                            size="small"
                                            onClick={toggleAllOpen}
                                        >
                                            {allOpen ? (
                                                <KeyboardArrowUpIcon/>
                                            ) : (
                                                <KeyboardArrowDownIcon/>
                                            )}
                                        </IconButton>
                                    </TableCell>

                                    <TableCell className="ext-list-table-cell">
                                        Name
                                    </TableCell>
                                    <TableCell className="ext-list-table-cell">
                                        Namespace
                                    </TableCell>

                                    <TableCell className="ext-list-table-cell">
                                        Provider
                                    </TableCell>
                                    <TableCell className="ext-list-table-cell">""</TableCell>
                                    <TableCell className="ext-list-table-cell">""</TableCell>
                                    <TableCell className="ext-list-table-cell">""</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows.map((row: any) => (
                                    <ExtClusterRow
                                        key={row.name}
                                        row={row}
                                        allOpen={allOpen}
                                        isSmallScreen={isSmallScreen}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </Container>
    );
};

export default ExtClusterTable;
