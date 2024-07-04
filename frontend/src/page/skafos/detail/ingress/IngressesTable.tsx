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
import { CustomTypography } from "../../../../style/font/CustomTypography";
import "./ing-table.css";
import "../shared-layout.css";
import { StyledTableRow } from "../SharedTableStyle";
import Spinner from "../../../../shared/component/spinner/spinner";
import { TimerCounter } from "../../../../shared/component/TimerCounter";
import OptionsButton from "../deployment/options/MoreOptionsButton";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { toNumber } from "lodash";
import { shakeAnimation } from "../../list/grid/AnimationList";
import { useInterval } from "../../../../hooks/useInterval";
import {Config} from "../../../../config";

const YAML = require("json-to-pretty-yaml");

interface IngressesProps {
  skafosNamespace: string;
  skafosName: string;
  resourceNamespace: string;
  resourceName: string;
}

const IngTable: React.FC<IngressesProps> = () => {
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
    ResourceApi.getIngresses(namespace!, name!)
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
      ResourceApi.deleteIngress(
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
    <Container maxWidth={false} className="ing-container">
      <Box className="ing-main-box">
        <Paper className="ing-title-paper">
          <CustomTypography variant="h6">Ingresses</CustomTypography>
          <motion.div {...shakeAnimation}>
            <Tooltip title="Click on row to be directed to selected Ingress overview.">
              <IconButton size="small">
                <InfoIcon className="ing-tooltip-icon" />
              </IconButton>
            </Tooltip>
          </motion.div>
        </Paper>

        <Paper className="ing-filter-paper">
          <Box display="flex" alignItems="center" mb={2}>
            <FormControl
              className="ing-form-control"
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

        <Paper className="pagination-list-table-container">
          <TableContainer
            component={Paper}
            className="ing-list-table-container"
          >
            <Table aria-label="ing-collapsible table">
              <TableHead>
                <TableRow>
                  {!isSmallScreen && (
                    <TableCell className="ing-table-cell-1" padding={"none"} />
                  )}
                  <TableCell className="ing-table-cell-1">Name</TableCell>
                  {!isSmallScreen && (
                    <TableCell className="ing-table-cell-1">
                      Namespace
                    </TableCell>
                  )}
                  <TableCell className="dp-table-cells">Age</TableCell>
                  <TableCell className="ing-table-cell-1">Label</TableCell>
                  <TableCell className="ing-table-cell-1">
                    Load Balancer
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
                      <Spinner />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any, index: number) => (
                      <StyledTableRow
                        key={row.metadata.uid}
                        onClick={() => handleRowClick(row)}
                        className="ing-row"
                        sx={{ cursor: "pointer" }}
                      >
                        {!isSmallScreen && <TableCell padding={"none"} />}
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
                          {Object.keys(row.metadata.labels || {}).join(", ")}
                        </TableCell>

                        <TableCell className="shared-cell-width">
                          {YAML.stringify(row.status.loadBalancer, null, 2)}
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
          <Box mt={2} className="ing-dialog-box">
            <Dialog
              open={dialogOpen}
              onClose={handleDialogClose}
              maxWidth="md"
              fullWidth
              className="ing-dialog"
            >
              <DialogTitle className="ing-dialog-title">
                <Tooltip title="Scroll down">
                  <IconButton size="small">
                    <KeyboardDoubleArrowDownIcon className="cm-icon" />
                  </IconButton>
                </Tooltip>
                Selected Ingress Details:
              </DialogTitle>
              <DialogContent>
                <TextField
                  className="ing-text-field"
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
export default IngTable;
