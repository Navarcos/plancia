import React, { useEffect, useState } from "react";
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
import { motion } from "framer-motion";
import { ResourceApi } from "../../../../service/resourceApi";
import { useNavigate, useParams } from "react-router-dom";

import { StyledTableRow } from "../SharedTableStyle";
import { CustomTypography } from "../../../../style/font/CustomTypography";
import OptionsButton from "../deployment/options/MoreOptionsButton";
import { TimerCounter } from "../../../../shared/component/TimerCounter";
import "./config-maps.css";
import Spinner from "../../../../shared/component/spinner/spinner";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { shakeAnimation } from "../../list/grid/AnimationList";
import { useInterval } from "../../../../hooks/useInterval";
import {Config} from "../../../../config";


interface ConfigMapsTableProps {
  skafosNamespace: string;
  skafosName: string;
  resourceNamespace: string;
  resourceName: string;
}

interface ConfigMap {
  apiVersion: string;
  kind: string;
  metadata: {
    annotations: Record<string, string>;
    creationTimestamp: string;
    name: string;
    namespace: string;
    resourceVersion: string;
    uid: string;
  };
  data: Record<string, string>;
}

const ConfigMapsTable: React.FC<ConfigMapsTableProps> = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [rows, setRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [filterNamespace, setFilterNamespace] = useState<string>("");

  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [delay, setDelay] = useState<any>(Config.pollingInterval);
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  let { namespace, name } = useParams();
  if (namespace === undefined || name === undefined) {
    navigate("/error");
  }

  function renderCreation(timestamp: string | undefined) {
    if (!timestamp) return "";

    const timestampMills = new Date(timestamp).getTime();
    return (
      <Box className="cellStyle">
        <TimerCounter timestampMills={timestampMills} />
      </Box>
    );
  }

  function fetchData(namespace: string, name: string) {
    ResourceApi.getConfigMaps(namespace!, name!)
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
      (row: ConfigMap) =>
        (!filterNamespace || row.metadata.namespace === filterNamespace) &&
        row.metadata.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [rows, filterNamespace, searchText]);

  const handleRowClick = (row: ConfigMap) => {
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

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const onDelete = (row: any) => {
    Promise.resolve(
      ResourceApi.deleteConfigMap(
        namespace!,
        name!,
        row.metadata.namespace,
        row.metadata.name
      )
    )
      .catch((err) => console.log(err))
      .then();
  };

  const handleCollapse = (row: ConfigMap) => {
    if (expandedRow === row.metadata.uid) {
      setExpandedRow(null);
    } else {
      setExpandedRow(row.metadata.uid);
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth={false} className="cm-container">
      <Box className="cm-main-box">
        <Paper className="cm-title-paper">
          <CustomTypography variant="h6">ConfigMaps</CustomTypography>
          <motion.div {...shakeAnimation}>
            <Tooltip title="Click on row to be directed to selected ConfigMap keys.">
              <IconButton size="small">
                <InfoIcon className="cm-tooltip-icon" />
              </IconButton>
            </Tooltip>
          </motion.div>
        </Paper>

        <Paper className="cm-filter-paper">
          <Box display="flex" alignItems="center" mb={2}>
            <FormControl
              className="cm-form-control"
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
              style={{ marginLeft: "16px" }}
            />
          </Box>
        </Paper>

        <Paper className="cm-list-table-container">
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  {!isSmallScreen && (
                    <TableCell className="cm-table-cell-1" padding={"none"} />
                  )}
                  <TableCell className="cm-table-cells">Name</TableCell>
                  {!isSmallScreen && (
                    <TableCell className="cm-table-cells">Namespace</TableCell>
                  )}
                  <TableCell className="cm-table-cells">Age</TableCell>
                  <TableCell className="cm-table-cells">Keys</TableCell>
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
                      <Spinner />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: ConfigMap) => (
                      <StyledTableRow
                        key={row.metadata.uid}
                        onClick={() => handleRowClick(row)}
                        className="cm-row"
                        sx={{ cursor: "pointer" }}
                      >
                        {!isSmallScreen && <TableCell padding={"none"} />}
                        <TableCell className="shared-cell-width">
                          {row.metadata.name || ""}
                        </TableCell>
                        {!isSmallScreen && (
                          <TableCell className="shared-cell-width">
                            {row.metadata.namespace || ""}
                          </TableCell>
                        )}
                        <TableCell className="shared-cell-width">
                          {row.metadata.creationTimestamp &&
                            renderCreation(row.metadata.creationTimestamp)}
                        </TableCell>
                        <TableCell className="shared-cell-width">
                          <Box display="flex" alignItems="center">
                            <motion.div {...shakeAnimation}>
                              <Tooltip title="Click here to check key values.">
                                <IconButton size="small">
                                  <HelpOutlineIcon className="cm-icon" />
                                </IconButton>
                              </Tooltip>
                            </motion.div>
                            <Typography>
                              {Object.keys(row.data || {}).join(", ")}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell className="shared-option-cell">
                          <OptionsButton
                            showDelete={true}
                            showView={true}
                            onDelete={() => onDelete(row)}
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
          <Box mt={2} className="cm-dialog-box">
            <Dialog
              open={dialogOpen}
              onClose={handleDialogClose}
              maxWidth="md"
              fullWidth
              className="cm-dialog"
            >
              <DialogTitle className="cm-dialog-title">
                <CustomTypography>
                  <Tooltip title="Scroll down">
                    <IconButton size="small">
                      <KeyboardDoubleArrowDownIcon className="cm-icon" />
                    </IconButton>
                  </Tooltip>
                  Selected ConfigMap Details:
                </CustomTypography>
              </DialogTitle>
              <DialogContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Key</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRow && (
                      <React.Fragment key={selectedRow.metadata.uid}>
                        <TableRow
                          onClick={() => handleCollapse(selectedRow)}
                          sx={{ cursor: "pointer" }}
                        >
                          <Box display="flex" alignItems="center">
                            <motion.div {...shakeAnimation}>
                              <Tooltip title="Click here to check key values.">
                                <IconButton size="small">
                                  <TouchAppIcon className="cm-tooltip-icon" />
                                </IconButton>
                              </Tooltip>
                            </motion.div>
                            <TableCell>{selectedRow.metadata.name}</TableCell>
                          </Box>
                        </TableRow>
                        {expandedRow === selectedRow.metadata.uid && (
                          <TableRow>
                            <TableCell colSpan={2}>
                              <Table>
                                <TableBody>
                                  {Object.entries(selectedRow.data).map(
                                    ([key, value]) => (
                                      <TableRow key={key}>
                                        <TableCell>{key}</TableCell>
                                        <TableCell>
                                          <Typography
                                            style={{ whiteSpace: "pre-wrap" }}
                                          >
                                            {value as string}
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    )}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ConfigMapsTable;
