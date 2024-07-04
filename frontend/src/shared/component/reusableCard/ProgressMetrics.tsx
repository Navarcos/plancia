import React, { useEffect, useState } from "react";
import { LinearProgress, Stack } from "@mui/material";

interface LinearProgressBarBarProps {
  value: number;
}

const LinearProgressBar: React.FC<LinearProgressBarBarProps> = ({ value }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress < value) {
        currentProgress += 1;
        setProgress(currentProgress);
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <Stack sx={{ width: "100%", color: "teal.500" }} spacing={2}>
      <LinearProgress variant="determinate" value={progress} color="inherit" />
    </Stack>
  );
};

export default LinearProgressBar;
