import * as React from "react";
import Typography from "@mui/material/Typography";
import { Container, Grid, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { DataItem } from "../controlPlane/ControlPlaneCard";
import "./detail-card.css";
import { CustomTypography } from "../../../../../../style/font/CustomTypography";


const DetailCard: React.FC<{
  title: string;
  data?: {
    [key: string]: string | DataItem[] | undefined;
  };
}> = ({ title, data }) => {
  return (
    <Container maxWidth={false} disableGutters className="dt-grid-container">
      <Paper className="dt-paper-card">
        <Box display="flex" className="dt-title-box">
          <CustomTypography variant="h6" color="textPrimary" gutterBottom>
            {title}
          </CustomTypography>
        </Box>

        <Grid container spacing={2}>
          {data &&
            Object.entries(data).map(([key, value]) => (
              <React.Fragment key={key}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={5}
                  xl={5}
                  xxl={5}
                  sx={{ padding: 0 }}
                >
                  <Box className="dt-data-item">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      className="dt-item-title"
                    >
                      <span>{key}:</span>
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={7}
                  xl={7}
                  xxl={7}
                  sx={{ padding: 0 }}
                >
                  {Array.isArray(value) ? (
                    value.map((item, index) => (
                      <Box className="dt-status-item" key={index}>
                        <Typography variant="body2" color="textPrimary">
                          {/* <strong>{item.key}:</strong> {item.value} */}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Box className="dt-data-item">
                      <Typography variant="body2" color="textPrimary">
                        {value}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </React.Fragment>
            ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default DetailCard;
