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
import InfoIcon from "@mui/icons-material/Info";
import {ResourceApi} from "../../../../service/resourceApi";
import {useNavigate, useParams} from "react-router-dom";
import {CustomTypography} from "../../../../style/font/CustomTypography";
import {TimerCounter} from "../../../../shared/component/TimerCounter";
import "./pods-table.css";
import {StyledTableRow} from "../SharedTableStyle";
import Spinner from "../../../../shared/component/spinner/spinner";
import OptionsButton from "../deployment/options/MoreOptionsButton";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import {useInterval} from "../../../../hooks/useInterval";
import {Config} from "../../../../config";


const YAML = require("json-to-pretty-yaml");


const PodTable: React.FC = () => {
    const isSmallScreen = useMediaQuery("(max-width:600px)");

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

    const onDelete = (row: any) => {
        Promise.resolve(
            ResourceApi.deletePod(
                namespace!,
                name!,
                row.metadata.namespace,
                row.metadata.name
            )
        )
            .catch((err) => console.log(err))
            .then();
    };

    function renderCreation(timestamp: string | undefined) {
        if (!timestamp) return "";

        const timestampMills = new Date(timestamp).getTime();
        return (
            <div className="cellStyle">
                <TimerCounter timestampMills={timestampMills}/>
            </div>
        );
    }

    function fetchData(namespace: string, name: string) {
        ResourceApi.getPods(namespace!, name!)
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

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container maxWidth={false} className="pods-container">
            <Box className="pods-main-box">
                <Paper className="pods-title-paper">
                    <CustomTypography variant="h6">Pods</CustomTypography>
                    <Tooltip title="Click on row to be directed to selected Pod overview.">
                        <IconButton size="small">
                            <InfoIcon className="pods-tooltip-icon"/>
                        </IconButton>
                    </Tooltip>
                </Paper>

                <Paper className="pods-filter-paper">
                    <Box display="flex" alignItems="center" mb={2}>
                        <FormControl
                            className="pods-form-control"
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
                        className="pods-list-table-container"
                    >
                        <Table aria-label="pods-collapsible table">
                            {isLoading ? (
                                <TableBody>
                                    <TableRow>
                                        <TableCell
                                            colSpan={10}
                                            align="center"
                                            sx={{height: "400px"}}
                                        >
                                            <Spinner/>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ) : (
                                <>
                                    <TableHead>
                                        <TableRow>
                                            {!isSmallScreen && (
                                                <TableCell
                                                    className="pods-table-cell-1"
                                                    padding={"none"}
                                                />
                                            )}
                                            <TableCell className="pods-table-cell-1">Name</TableCell>
                                            {!isSmallScreen && (
                                                <TableCell className="pods-table-cell-1">
                                                    Namespace
                                                </TableCell>
                                            )}
                                            <TableCell className="pods-table-cell-1">Age</TableCell>
                                            <TableCell className="pods-table-cell-1">
                                                Containers
                                            </TableCell>
                                            <TableCell className="pods-table-cell-1">
                                                Restarts
                                            </TableCell>
                                            <TableCell className="pods-table-cell-1">
                                                Controlled By:
                                            </TableCell>
                                            <TableCell className="pods-table-cell-1">Node</TableCell>
                                            <TableCell className="pods-table-cell-1">Qos</TableCell>
                                            <TableCell className="pods-table-cell-1">
                                                Status
                                            </TableCell>
                                            <TableCell className="shared-option-cell">
                                                Options
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredRows
                                            .slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            )
                                            .map((row: any) => (
                                                <StyledTableRow
                                                    key={row.metadata.uid}
                                                    onClick={() => handleRowClick(row)}
                                                    className="pods-row"
                                                    sx={{cursor: "pointer"}}
                                                >
                                                    {!isSmallScreen && <TableCell padding={"none"}/>}
                                                    <TableCell className="shared-cell-width">
                                                        {row.metadata.name}
                                                    </TableCell>
                                                    {!isSmallScreen && (
                                                        <TableCell className="shared-cell-width">
                                                            {row.metadata.namespace}
                                                        </TableCell>
                                                    )}
                                                    <TableCell className="shared-cell-width">
                                                        {renderCreation(row.metadata.creationTimestamp)}
                                                    </TableCell>
                                                    <TableCell className="shared-cell-width">
                                                        {row.spec.containers
                                                            .map((container: any) => container.name)
                                                            .join(", ")}
                                                    </TableCell>
                                                    <TableCell className="shared-cell-width">
                                                        {
                                                            !row.status.containerStatuses ? 0 :
                                                                row.status.containerStatuses.reduce(
                                                                    (acc: number, container: any) =>
                                                                        acc + container.restartCount,
                                                                    0
                                                                )}
                                                    </TableCell>
                                                    <TableCell className="shared-cell-width">
                                                        {row.metadata.ownerReferences?.[0]?.name || "N/A"}
                                                    </TableCell>
                                                    <TableCell className="shared-cell-width">
                                                        {row.spec.nodeName || "N/A"}
                                                    </TableCell>
                                                    <TableCell className="shared-cell-width">
                                                        {row.status.qosClass}
                                                    </TableCell>
                                                    <TableCell className="shared-cell-width">
                                                        {row.status.phase}
                                                    </TableCell>
                                                    <TableCell className="shared-option-cell">
                                                        <OptionsButton
                                                            onDelete={() => onDelete(row)}
                                                            row={row}
                                                        />
                                                    </TableCell>
                                                </StyledTableRow>
                                            ))}
                                        {filteredRows.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={10} align="center">
                                                    No pods found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </>
                            )}
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>

            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    <Typography variant="h6">Selected Pod Details</Typography>
                    <Tooltip title="Scroll down">
                        <IconButton size="small">
                            <KeyboardDoubleArrowDownIcon className="cm-icon"/>
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent>
                    {selectedRow && (
                        <TextField
                            className="pods-text-field"
                            fullWidth
                            multiline
                            rows={20}
                            value={YAML.stringify(selectedRow, null, 2)}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default PodTable;
