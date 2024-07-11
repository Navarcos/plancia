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
import {SkafosListItemResponse} from "../../../../model/vsphere/skafos";
import useMediaQuery from "@mui/material/useMediaQuery";
import {SkafosApi} from "../../../../service/skafosApi";
import "../../../../index.css";
import "./skafos-table.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoIcon from "@mui/icons-material/Info";
import {motion} from "framer-motion";
import {shakeAnimation} from "./AnimationList";
import {CustomTypography} from "../../../../style/font/CustomTypography";
import SkafosRow from "../collapsible/SkafosRow";
import {useInterval} from "../../../../hooks/useInterval";
import {Config} from "../../../../config";


const SkafosTable: React.FC = () => {
    console.log(Config.pollingInterval)
    const isSmallScreen = useMediaQuery("(max-width:600px)");
    const [rows, setRows] = useState<SkafosListItemResponse[]>([]);
    const [allOpen, setAllOpen] = useState(true);
    const [delay, setDelay] = useState<any>(Config.pollingInterval);

    function fetchData() {
        SkafosApi.getAllSkafos()
            .then((result) => setRows(result))
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    useInterval(() => {
        fetchData()
    }, delay);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setDelay(null);
            } else {
                setDelay(Config.pollingInterval);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const toggleAllOpen = () => {
        setAllOpen(!allOpen);
    };

    return (
        <Container maxWidth={false}>

            <Box className="title-box">
                <Paper className="title-paper">
                    <CustomTypography variant="h6">
                        Skafos Main Details
                    </CustomTypography>
                    <motion.div {...shakeAnimation}>
                        <Tooltip title="Click on row to be directed to selected skafos overview.">
                            <IconButton size="small">
                                <InfoIcon className="st-icon"/>
                            </IconButton>
                        </Tooltip>
                    </motion.div>
                </Paper>

                <TableContainer component={Paper} className="list-table-container">
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell className="table-cell-collapse">
                                    <IconButton
                                        className="icon-collapse"
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
                                <TableCell className="table-cell-1" padding={"none"}/>
                                <TableCell className="table-cells">Phase</TableCell>
                                <TableCell className="table-cells">Name</TableCell>
                                <TableCell className="table-cells">Namespace</TableCell>

                                <TableCell className="table-cells">Provider</TableCell>
                                <TableCell className="table-cells">Version</TableCell>
                                <TableCell className="table-cells">N° Master</TableCell>
                                <TableCell className="table-cells">N° Worker</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <SkafosRow
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
        </Container>
    );
};

export default SkafosTable;
