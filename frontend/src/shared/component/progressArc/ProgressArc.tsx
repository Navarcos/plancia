import { SkafosResourceStats } from "../../../model/vsphere/subelements/element";
import React from "react";
import { PieChart } from "@mui/x-charts";
import "./progress-arc.css";
import { LegendParams } from "@mui/x-charts/models/seriesType/config";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";

const ProgressArc = (props: {
  resource: string;
  stats: SkafosResourceStats | undefined;
}) => {
  const chartData = prepareData(props.stats);
  const legendParams = buildLegendParams(chartData);
  return (
    <Container className={"chart-container"}>
      <Typography className={"title"}>{props.resource}</Typography>
      <PieChart
        series={[
          {
            data: chartData,
            innerRadius: 40,
            outerRadius: 50,
            paddingAngle: 1,
            highlightScope: { faded: "global", highlighted: "item" },
            // faded: { innerRadius: 30, additionalRadius: -10 },
          },
        ]}
        width={300}
        height={150}
        slotProps={{
          legend: {
            seriesToDisplay: legendParams,
            direction: "column",
            position: {
              horizontal: "right",
              vertical: "middle",
            },
            labelStyle: {
              fontSize: 14,
              fontWeight: "bold",
            },
            itemMarkHeight: 10,
            itemMarkWidth: 10,
          },
        }}
      />
    </Container>
  );
};

function prepareData(stats: SkafosResourceStats | undefined): any[] {
  const result: any[] = [];
  if (!stats) return result;

  if (isPresent(stats.running)) {
    result.push({
      label: "Running",
      value: stats.running,
      color: "mediumSpringGreen",
    });
  }
  if (isPresent(stats.pending)) {
    result.push({ label: "Pending", value: stats.pending, color: "orange" });
  }
  if (isPresent(stats.succeeded)) {
    result.push({
      label: "Succeeded",
      value: stats.succeeded,
      color: "darkGreen",
    });
  }
  if (isPresent(stats.failed)) {
    result.push({ label: "Failed", value: stats.failed, color: "red" });
  }
  return result;
}

function buildLegendParams(chartData: any[]): LegendParams[] {
  let params: LegendParams[] = [];
  for (let entry of chartData) {
    params.push({
      id: entry.label,
      color: entry.color,
      label: entry.value + " " + entry.label,
    });
  }
  return params;
}

function isPresent(value: number) {
  return value !== null && value !== undefined && value !== 0;
}

export default ProgressArc;
