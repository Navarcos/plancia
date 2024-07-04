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
import "./nodes-table.css";
import InfoIcon from "@mui/icons-material/Info";
import { motion } from "framer-motion";
import { ResourceApi } from "../../../../service/resourceApi";
import { useNavigate, useParams } from "react-router-dom";
import "../shared-layout.css";
import { StyledTableRow } from "../SharedTableStyle";
import { CustomTypography } from "../../../../style/font/CustomTypography";
import Spinner from "../../../../shared/component/spinner/spinner";
import { TimerCounter } from "../../../../shared/component/TimerCounter";
import OptionsButton from "../deployment/options/MoreOptionsButton";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { toNumber } from "lodash";
import { shakeAnimation } from "../../list/grid/AnimationList";
import { useInterval } from "../../../../hooks/useInterval";
import {Config} from "../../../../config";

const YAML = require("json-to-pretty-yaml");

interface NodesTableProps {
  skafosNamespace: string;
  skafosName: string;
  resourceNamespace: string;
  resourceName: string;
}

const NodesTable: React.FC<NodesTableProps> = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [rows, setRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState<string>("");

  const [names, setNames] = useState<string[]>([]);
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
    ResourceApi.getNodes(namespace!, name!)
      .then((data) => {
        console.log(data);
        setRows(data.items);
        const names: string[] = Array.from(
          new Set(data.items.map((item: any) => item.metadata.name))
        );
        setNames(names);
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
        (!filterName || row.metadata.name === filterName) &&
        row.metadata.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [rows, filterName, searchText]);

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
    <Container maxWidth={false} className="nd-container">
      <Box className="nd-main-box">
        <Paper className="nd-title-paper">
          <CustomTypography variant="h6">Nodes</CustomTypography>
          <motion.div {...shakeAnimation}>
            <Tooltip title="Click on row to be directed to selected Node overview.">
              <IconButton size="small">
                <InfoIcon className="nd-tooltip-icon" />
              </IconButton>
            </Tooltip>
          </motion.div>
        </Paper>

        <Paper className="nd-filter-paper">
          <Box display="flex" alignItems="center" mb={2}>
            <FormControl
              className="nd-form-control"
              variant="outlined"
              margin="dense"
            >
              <InputLabel>All names</InputLabel>
              <Select
                value={filterName}
                onChange={(e) => setFilterName(e.target.value as string)}
                label="Filter By Namespace"
              >
                <MenuItem value="">All</MenuItem>
                {names.map((names) => (
                  <MenuItem key={names} value={names}>
                    {names}
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

        <Paper className="pagination-list-table-container">
          {isLoading ? (
            <Box className="spinner-table">
              <Spinner />
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              className="nd-list-table-container"
            >
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    {!isSmallScreen && (
                      <TableCell className="nd-table-cell-1" padding={"none"} />
                    )}
                    <TableCell className="nd-table-cells">Name</TableCell>
                    <TableCell className="nd-table-cells">Age</TableCell>
                    <TableCell className="nd-table-cells">Taints</TableCell>
                    <TableCell className="nd-table-cells">Version</TableCell>
                    <TableCell className="cm-table-cells">Conditions</TableCell>
                    <TableCell className="cm-table-cells">Options</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any) => (
                      <StyledTableRow
                        key={row.metadata.uid}
                        onClick={() => handleRowClick(row)}
                        className="nd-row"
                        sx={{ cursor: "pointer" }}
                      >
                        {!isSmallScreen && <TableCell padding={"none"} />}
                        <TableCell className="shared-cell-width">
                          {row.metadata.name}
                        </TableCell>
                        <TableCell className="shared-cell-width">
                          {renderCreation(row.metadata.creationTimestamp)}
                        </TableCell>
                        <TableCell className="shared-cell-width">
                          <Tooltip
                            title={
                              row.spec.taints && row.spec.taints.length > 0
                                ? row.spec.taints
                                    .map((taint: any) => taint.key)
                                    .join(", ")
                                : "No Taints"
                            }
                          >
                            <span>
                              {row.spec.taints ? row.spec.taints.length : 0}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="shared-cell-width">
                          {row.status.nodeInfo.kubeletVersion}
                        </TableCell>
                        <TableCell className="shared-cell-width">
                          {(() => {
                            if (row.status.conditions) {
                              const readyCondition = row.status.conditions.find(
                                (condition: any) =>
                                  condition.type === "Ready" &&
                                  condition.status === "True"
                              );
                              return readyCondition ? "Ready" : "Not Ready";
                            } else {
                              return "Condition Unknown";
                            }
                          })()}
                        </TableCell>

                        <TableCell className="shared-option-cell">
                          <OptionsButton
                            showDelete={false}
                            showView={true}
                            row={row}
                          />
                        </TableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
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
          <Box mt={2} className="nd-dialog-box">
            <Dialog
              open={dialogOpen}
              onClose={handleDialogClose}
              maxWidth="md"
              fullWidth
              className="nd-dialog"
            >
              <DialogTitle className="nd-dialog-title">
                <Tooltip title="Scroll down">
                  <IconButton size="small">
                    <KeyboardDoubleArrowDownIcon className="cm-icon" />
                  </IconButton>
                </Tooltip>
                Selected Node Details:
              </DialogTitle>
              <DialogContent>
                <TextField
                  className="nd-text-field"
                  fullWidth
                  multiline
                  rows={20}
                  value={YAML.stringify(selectedRow)}
                  InputProps={{ readOnly: true }}
                />
              </DialogContent>
            </Dialog>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default NodesTable;
