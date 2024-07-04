import React, {useEffect, useState} from "react";
import {
    Box,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import {ResourceApi} from "../../../../service/resourceApi";
import {useNavigate, useParams} from "react-router-dom";

import "./services-table.css";
import "../shared-layout.css";
import {TimerCounter} from "../../../../shared/component/TimerCounter";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import {toNumber} from "lodash";
import {useInterval} from "../../../../hooks/useInterval";
import {CustomTypography} from "../../../../style/font/CustomTypography";
import {shakeAnimation} from "../../list/grid/AnimationList";
import InfoIcon from "@mui/icons-material/Info";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import {motion} from "framer-motion";
import Spinner from "../../../../shared/component/spinner/spinner";
import {StyledTableRow} from "../SharedTableStyle";
import OptionsButton from "../deployment/options/MoreOptionsButton";
import {Config} from "../../../../config";

const YAML = require("json-to-pretty-yaml");


interface ServicesProps {
    skafosNamespace: string;
    skafosName: string;
    resourceNamespace: string;
    resourceName: string;
}

const ServicesTable: React.FC<ServicesProps> = () => {
    const [rows, setRows] = useState<any[]>([]);
    const [filteredRows, setFilteredRows] = useState<any>([]);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [filterNamespace, setFilterNamespace] = useState<string>("");

    const [namespaces, setNamespaces] = useState<string[]>([]);
    const [searchText, setSearchText] = useState<string>("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [delay, setDelay] = useState<any>(Config.pollingInterval);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    let {namespace, name} = useParams();
    if (namespace === undefined || name === undefined) {
        navigate("/error");
    }

    function renderCreation(timestamp: string | undefined) {
        if (!timestamp) return "";

        const timestampMills = new Date(timestamp).getTime();
        return (
            <Box className="cellStyle">
                <TimerCounter timestampMills={timestampMills}/>
            </Box>
        );
    }

    function fetchData(namespace: string, name: string) {
        ResourceApi.getServices(namespace!, name!)
            .then((data) => {
                console.log(data);
                setRows(data.items);
                const namespaces: string[] = Array.from(
                    new Set(data.items.map((item: any) => item.metadata.namespace))
                );

                setNamespaces(namespaces);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setRows([]);
            })
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        fetchData(namespace!, name!);
    }, [namespace, name]);
    useInterval(() => {
        if (!rows) {
            setIsLoading(true);
        }
        fetchData(namespace!, name!);
    }, delay);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setDelay(null);
            } else {
                setDelay(Config.pollingInterval);
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        const filtered = rows.filter(
            (row: any) =>
                (!filterNamespace || row.metadata.namespace === filterNamespace) &&
                row.metadata.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredRows(filtered);
    }, [rows, filterNamespace, searchText]);

    const handleRowClick = (row: any) => {
        setSelectedRow(row);
        handleDialogOpen();
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onDelete = (row: any) => {
        Promise.resolve(
            ResourceApi.deleteService(
                namespace!,
                name!,
                row.metadata.namespace,
                row.metadata.name
            )
        )
            .catch((err) => console.log(err))
            .then();
    };

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container maxWidth={false} className="services-container">
            <Box className="services-main-box">
                <Paper className="services-title-paper">
                    <CustomTypography variant="h6">Services</CustomTypography>
                    <motion.div {...shakeAnimation}>
                        <Tooltip title="Click on row to be directed to selected Service overview.">
                            <IconButton size="small">
                                <InfoIcon className="services-tooltip-icon"/>
                            </IconButton>
                        </Tooltip>
                    </motion.div>
                </Paper>

                <Paper className="services-filter-paper">
                    <Box display="flex" alignItems="center" mb={2}>
                        <FormControl
                            className="services-form-control"
                            variant="outlined"
                            margin="dense"
                        >
                            <InputLabel>All namespaces</InputLabel>
                            <Select
                                value={filterNamespace}
                                onChange={(e) => setFilterNamespace(e.target.value as string)}
                                label="Filter By Namespace"
                            >
                                <MenuItem value="">All</MenuItem>
                                {namespaces.map((namespace) => (
                                    <MenuItem key={namespace} value={namespace}>
                                        {namespace}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Search"
                            variant="outlined"
                            margin="dense"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{marginLeft: "16px"}}
                        />
                    </Box>
                </Paper>

                <Paper className="pagination-list-table-container">
                    <TableContainer
                        component={Paper}
                        className="services-list-table-container"
                    >
                        <Table aria-label="services-collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="services-table-cell-1">Name</TableCell>

                                    <TableCell className="services-table-cell-1">
                                        Namespace
                                    </TableCell>

                                    <TableCell className="services-table-cell-1">Age</TableCell>

                                    <TableCell className="services-table-cell-1">
                                        Selector
                                    </TableCell>

                                    <TableCell className="services-table-cell-1">Ports</TableCell>

                                    <TableCell className="services-table-cell-1">Type</TableCell>

                                    <TableCell className="services-table-cell-1">
                                        Cluster IP
                                    </TableCell>
                                    <TableCell className="cm-table-cells">Options</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={10}
                                            className="spinner-table"
                                            align="center"
                                        >
                                            <Spinner/>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row: any, index: number) => (
                                            <StyledTableRow
                                                key={row.metadata.uid}
                                                onClick={() => handleRowClick(row)}
                                                className="services-row"
                                                sx={{cursor: "pointer"}}
                                            >
                                                <TableCell className="shared-cell-width">
                                                    {row.metadata.name}
                                                </TableCell>

                                                <TableCell className="shared-cell-width">
                                                    {row.metadata.namespace}
                                                </TableCell>

                                                <TableCell className="shared-cell-width">
                                                    {renderCreation(row.metadata.creationTimestamp)}
                                                </TableCell>

                                                <TableCell className="shared-cell-width">
                                                    {Object.keys(row.spec.selector || {}).join(", ")}
                                                </TableCell>

                                                <TableCell className="shared-cell-width">
                                                    {YAML.stringify(row.spec.ports, null, 2).replace(
                                                        /- /g,
                                                        "\n- "
                                                    )}
                                                </TableCell>

                                                <TableCell className="shared-cell-width">
                                                    {row.spec.type}
                                                </TableCell>

                                                <TableCell className="shared-cell-width">
                                                    {row.spec.clusterIP}
                                                </TableCell>
                                                <TableCell className="shared-option-cell">
                                                    <OptionsButton
                                                        showDelete={true}
                                                        showView={true}
                                                        onDelete={onDelete}
                                                        row={row}
                                                    />
                                                </TableCell>
                                            </StyledTableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>

                {selectedRow && (
                    <Box mt={2} className="services-dialog-box">
                        <Dialog
                            open={dialogOpen}
                            onClose={handleDialogClose}
                            maxWidth="md"
                            fullWidth
                            className="services-dialog"
                        >
                            <DialogTitle className="services-dialog-title">
                                <Tooltip title="Scroll down">
                                    <IconButton size="small">
                                        <KeyboardDoubleArrowDownIcon className="cm-icon"/>
                                    </IconButton>
                                </Tooltip>
                                Selected Service Details:
                            </DialogTitle>
                            <DialogContent>
                                <TextField
                                    className="services-text-field"
                                    fullWidth
                                    multiline
                                    rows={20}
                                    value={YAML.stringify(selectedRow, null, 2)}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                    </Box>
                )}
            </Box>
        </Container>
    );
};
export default ServicesTable;
