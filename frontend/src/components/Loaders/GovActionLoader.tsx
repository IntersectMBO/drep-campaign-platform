import { Box, Grid, Skeleton } from '@mui/material';
import React from 'react';

function GovActionLoader() {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'rgba(0, 0, 0, 0.11)',
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Skeleton
          variant="rectangular"
          width={60}
          height={20}
          className="rounded-xl"
        />
        <Skeleton
          variant="rectangular"
          width={80}
          height={20}
          className="rounded-xl"
        />
      </Grid>

      <Skeleton variant="text" width="80%" height={30} />

      <Skeleton variant="text" width="60%" height={20} />

      <Skeleton
        variant="rectangular"
        width="100%"
        height={25}
        className="rounded-xl"
      />

      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton variant="text" width="50%" height={20} />
      <Skeleton variant="text" width="50%" height={20} />
    </Box>
  );
}

export default GovActionLoader;
