import React, { useEffect, useState } from "react";
import { Box, Paper, TextField, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ResourceApi } from "../../../../service/resourceApi";
import { useNavigate, useParams } from "react-router-dom";
import "./kube-config.css";
const YAML = require("json-to-pretty-yaml");

interface KubeConfigProps {
  skafosNamespace: string;
  skafosName: string;
}

const KubeConfigCard: React.FC<KubeConfigProps> = ({
  skafosNamespace,
  skafosName,
}) => {
  const [yamlData, setYamlData] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  let { namespace, name } = useParams();
  if (namespace === undefined || name === undefined) {
    navigate("/error");
  }

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    ResourceApi.getKubeConfig(namespace!, name!)
      .then((data) => {
        setYamlData(YAML.stringify(data));
      })
      .catch((error) => {
        console.error("Error fetching KubeConfig:", error);
        setError(
          "Failed to load Kubernetes configuration, please try again later."
        );
        setYamlData(YAML.stringify());
      })
      .finally(() => setIsLoading(false));
  }, [namespace, name]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(yamlData);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Paper elevation={3} className="kc-paper">
        <Box display="flex" justifyContent="flex-end">
          <IconButton
            onClick={handleCopyToClipboard}
            aria-label="copy to clipboard"
          >
            <ContentCopyIcon />
          </IconButton>
        </Box>

        <TextField
          multiline
          fullWidth
          rows={20}
          value={yamlData}
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />
      </Paper>
    </Box>
  );
};

export default KubeConfigCard;
