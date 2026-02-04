import React from "react";
import { Skeleton, Box } from "@mui/material";

export default function LoadingPlaceholder() {
  return (
    <Box>
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      <Skeleton height={30} sx={{ mt:1 }} />
      <Skeleton height={20} width="60%" />
    </Box>
  );
}
