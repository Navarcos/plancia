import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import "../reusableCard/cards.css";
import React, { useEffect, useState } from "react";
import LinearProgressBar from "./ProgressMetrics";
import { CustomTypography } from "../../../style/font/CustomTypography";
import { SkafosApi } from "../../../service/skafosApi";
import axios from "axios";

interface CardsProps {
  skafosNamespace: string;
  skafosName: string;
}

const Cards: React.FC<CardsProps> = ({ skafosNamespace, skafosName }) => {
  const [cardData, setCardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardTitles = ["Memory", "CPU"];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await SkafosApi.getMetrics(skafosNamespace, skafosName);
        const formattedData = formatMetricsData(data);
        setCardData(formattedData);
        setLoading(false);
        setError(null);
      } catch (reason: any) {
        handleFetchError(reason);
      }
    };

    const formatMetricsData = (data: any) => {
      return {
        Memory: {
          description: {
            capacity: (data.memory.capacity / 1024).toFixed(2) + " MB",
            allocatable: (data.memory.allocatable / 1024).toFixed(2) + " MB",
            used: (data.memory.used / 1024).toFixed(2) + " MB",
          },
          metrics: (data.memory.used / data.memory.allocatable) * 100,
        },
        CPU: {
          description: {
            capacity: (data.cpu.capacity / 1000).toFixed(2),
            allocatable: (data.cpu.allocatable / 1000).toFixed(2),
            used: (data.cpu.used / 1000).toFixed(2),
          },
          metrics: (data.cpu.used / data.cpu.allocatable) * 100,
        },
      };
    };

    const handleFetchError = (reason: any) => {
      if (axios.isAxiosError(reason) && reason.response) {
        if (reason.response.status === 404) {
          setError("Metric server not enabled");
        } else if (reason.response.status === 500) {
          setError(null);
        }
      } else {
        console.error("Error fetching metrics, please try again.", reason);
      }
      setCardData({
        Memory: {
          description: {
            capacity: "0",
            allocatable: "0",
            used: "0",
          },
          metrics: 0,
        },
        CPU: {
          description: {
            capacity: "0",
            allocatable: "0",
            used: "0",
          },
          metrics: 0,
        },
      });
      setLoading(false);
    };

    fetchMetrics();
  }, [skafosName, skafosNamespace]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth={false} disableGutters className="grid-container">
      <Grid container spacing={5} justifyContent="center" alignItems="center">
        {cardTitles.map((title, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            className="grid-item"
          >
            <Paper className="paper-cards">
              {error && (
                <Typography color="error" variant="body1">
                  {error}
                </Typography>
              )}
              <CustomTypography variant="h6">{title}</CustomTypography>
              <Typography
                color="textPrimary"
                className="description-box"
                component="div"
              >
                {cardData && cardData[title] ? (
                  <Box>
                    <Box mb={2}>
                      <Typography className="cards-element">
                        <strong>Capacity:</strong>{" "}
                        {cardData[title].description.capacity}
                      </Typography>
                    </Box>
                    <Box mb={2}>
                      <Typography className="cards-element">
                        <strong>Allocatable:</strong>{" "}
                        {cardData[title].description.allocatable}
                      </Typography>
                    </Box>
                    <Box mb={2}>
                      <Typography className="cards-element">
                        <strong>Used:</strong>{" "}
                        {cardData[title].description.used}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  "Loading..."
                )}
              </Typography>
              <Box mt="auto" className="linear-progress-box">
                <CustomTypography paddingBottom={2}>
                  {cardData && cardData[title]
                    ? `Usage: ${cardData[title].metrics.toFixed(2)}%`
                    : "Loading..."}
                </CustomTypography>
                <LinearProgressBar
                  value={
                    cardData && cardData[title] ? cardData[title].metrics : 0
                  }
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Cards;
