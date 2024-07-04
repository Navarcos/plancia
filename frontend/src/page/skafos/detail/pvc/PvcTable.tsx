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
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import "./pvc-table.css";
import InfoIcon from "@mui/icons-material/Info";
import {motion} from "framer-motion";
import {ResourceApi} from "../../../../service/resourceApi";
import {useNavigate, useParams} from "react-router-dom";

import {StyledTableRow} from "../SharedTableStyle";
import {CustomTypography} from "../../../../style/font/CustomTypography";
import Spinner from "../../../../shared/component/spinner/spinner";
import {TimerCounter} from "../../../../shared/component/TimerCounter";
import OptionsButton from "../deployment/options/MoreOptionsButton";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import {toNumber} from "lodash";
import {shakeAnimation} from "../../list/grid/AnimationList";
import {useInterval} from "../../../../hooks/useInterval";
import {Config} from "../../../../config";


const YAML = require("json-to-pretty-yaml");

interface PvcTableProps {
    skafosNamespace: string;
    skafosName: string;
    resourceNamespace: string;
    resourceName: string;
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

const PvcTable: React.FC<PvcTableProps> = () => {
    const isSmallScreen = useMediaQuery("(max-width:600px)");

    const [rows, setRows] = useState<any>([]);
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

    function fetchData(namespace: string, name: string) {
        ResourceApi.getPvcs(namespace!, name!)
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
            ResourceApi.deletePvc(
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
        <Container maxWidth={false} className="pvc-container">
            <Box className="pvc-main-box">
                <Paper className="pvc-title-paper">
                    <CustomTypography variant="h6">
                        Persistent Volume Claims
                    </CustomTypography>
                    <motion.div {...shakeAnimation}>
                        <Tooltip title="Click on row to be directed to selected PVC overview.">
                            <IconButton size="small">
                                <InfoIcon className="pvc-tooltip-icon"/>
                            </IconButton>
                        </Tooltip>
                    </motion.div>
                </Paper>

                <Paper className="pvc-filter-paper">
                    <Box display="flex" alignItems="center" mb={2}>
                        <FormControl
                            className="pvc-form-control"
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
                        className="pvc-list-table-container"
                    >
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    {!isSmallScreen && (
                                        <TableCell className="pvc-table-cell-1" padding={"none"}/>
                                    )}
                                    <TableCell className="pvc-table-cells">Name</TableCell>
                                    <TableCell className="pvc-table-cells">Namespace</TableCell>
                                    <TableCell className="pvc-table-cells">Age</TableCell>
                                    <TableCell className="pvc-table-cells">
                                        Storage Class
                                    </TableCell>
                                    <TableCell className="pvc-table-cells">Size</TableCell>
                                    <TableCell className="pvc-table-cells">Status</TableCell>
                                    <TableCell className="pvc-table-cells">Options</TableCell>
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
                                        .map((row: any) => (
                                            <StyledTableRow
                                                key={row.metadata.uid}
                                                onClick={() => handleRowClick(row)}
                                                className="pvc-row"
                                                sx={{cursor: "pointer"}}
                                            >
                                                {!isSmallScreen && <TableCell padding={"none"}/>}
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
                                                    {row.spec.storageClassName}
                                                </TableCell>
                                                <TableCell className="shared-cell-width">
                                                    {row.status.capacity.storage}
                                                </TableCell>

                                                <TableCell className="shared-cell-width">
                                                    {row.status.phase}
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
                    <Box mt={2} className="pvc-dialog-box">
                        <Dialog
                            open={dialogOpen}
                            onClose={handleDialogClose}
                            maxWidth="md"
                            fullWidth
                            className="pvc-dialog"
                        >
                            <DialogTitle className="pvc-dialog-title">
                                <Tooltip title="Scroll down">
                                    <IconButton size="small">
                                        <KeyboardDoubleArrowDownIcon className="cm-icon"/>
                                    </IconButton>
                                </Tooltip>
                                Selected Persisten Volume Claim Details:
                            </DialogTitle>
                            <DialogContent>
                                <TextField
                                    className="pvc-text-field"
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

export default PvcTable;
