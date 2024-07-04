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
import {motion} from "framer-motion";
import {ResourceApi} from "../../../../service/resourceApi";
import {useNavigate, useParams} from "react-router-dom";
import {CustomTypography} from "../../../../style/font/CustomTypography";
import {TimerCounter} from "../../../../shared/component/TimerCounter";
import "./helm-releases-table.css";
import {StyledTableRow} from "../SharedTableStyle";
import Spinner from "../../../../shared/component/spinner/spinner";
import OptionsButton from "../deployment/options/MoreOptionsButton";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import {toNumber} from "lodash";
import {shakeAnimation} from "../../list/grid/AnimationList";
import {useInterval} from "../../../../hooks/useInterval";
import {Config} from "../../../../config";

const YAML = require("json-to-pretty-yaml");


interface HelmRelProps {
    skafosNamespace: string;
    skafosName: string;
}

const HelmRelTable: React.FC<HelmRelProps> = () => {
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
        ResourceApi.getReleases(namespace!, name!)
            .then((data) => {
                console.log("getApi", data);
                setRows(data);
                const namespaces: string[] = Array.from(
                    new Set(data.map((data: any) => data.namespace))
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
                (!filterNamespace || row.namespace === filterNamespace) &&
                row.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredRows(filtered);
    }, [rows, filterNamespace, searchText]);

    const handleRowClick = (row: any) => {
        setSelectedRow(row.values);
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
        <Container maxWidth={false} className="hrel-container">
            <Box className="hrel-main-box">
                <Paper className="hrel-title-paper">
                    <CustomTypography variant="h6">Helm Releases</CustomTypography>
                    <motion.div {...shakeAnimation}>
                        <Tooltip title="Click on row to be directed to selected Release overview.">
                            <IconButton size="small">
                                <InfoIcon className="hrel-tooltip-icon"/>
                            </IconButton>
                        </Tooltip>
                    </motion.div>
                </Paper>

                <Paper className="hrel-filter-paper">
                    <Box display="flex" alignItems="center" mb={2}>
                        <FormControl
                            className="hrel-form-control"
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
                        className="hrel-list-table-container"
                    >
                        <Table aria-label="hrel-collapsible table">
                            <TableHead>
                                <TableRow>
                                    {!isSmallScreen && (
                                        <TableCell className="hrel-table-cell-1" padding={"none"}/>
                                    )}
                                    <TableCell className="hrel-table-cell-1">Name</TableCell>
                                    {!isSmallScreen && (
                                        <TableCell className="hrel-table-cell-1">
                                            Namespace
                                        </TableCell>
                                    )}
                                    <TableCell className="hrel-table-cell-1">Updated</TableCell>
                                    <TableCell className="hrel-table-cell-1">Chart</TableCell>
                                    <TableCell className="hrel-table-cell-1">Version</TableCell>

                                    <TableCell className="hrel-table-cell-1">Status</TableCell>
                                    <TableCell className="hrel-table-cell-1">Options</TableCell>
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
                                                onClick={() => handleRowClick(row)}
                                                key={row.name}
                                                className="hrel-row"
                                                sx={{cursor: "pointer"}}
                                            >
                                                {!isSmallScreen && <TableCell padding={"none"}/>}
                                                <TableCell className="shared-cell-width">
                                                    {row.name}
                                                </TableCell>
                                                {!isSmallScreen && (
                                                    <TableCell className="shared-cell-width">
                                                        {row.namespace}
                                                    </TableCell>
                                                )}
                                                <TableCell className="shared-cell-width">
                                                    {renderCreation(row.updated)}
                                                </TableCell>
                                                <TableCell className="shared-cell-width">
                                                    {row.chart}
                                                </TableCell>
                                                <TableCell className="shared-cell-width">
                                                    {row.version}
                                                </TableCell>
                                                <TableCell className="shared-cell-width">
                                                    {row.status}
                                                </TableCell>
                                                <TableCell className="shared-option-cell">
                                                    <OptionsButton
                                                        showDelete={false}
                                                        showView={true}
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
                    <Box mt={2} className="hrel-dialog-box">
                        <Dialog
                            open={dialogOpen}
                            onClose={handleDialogClose}
                            maxWidth="md"
                            fullWidth
                            className="hrel-dialog"
                        >
                            <DialogTitle className="hrel-dialog-title">
                                <Tooltip title="Scroll down">
                                    <IconButton size="small">
                                        <KeyboardDoubleArrowDownIcon className="cm-icon"/>
                                    </IconButton>
                                </Tooltip>
                                Selected Release Details:
                            </DialogTitle>
                            <DialogContent>
                                <TextField
                                    className="hrel-text-field"
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
export default HelmRelTable;
