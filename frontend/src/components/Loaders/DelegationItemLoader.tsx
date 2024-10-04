import { Box, Skeleton } from '@mui/material';
import React from 'react';

function DelegationItemLoader() {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 250,
        padding: '16px',

        borderRadius: '8px',
      }}
    >
      <Box className="flex flex-col items-center">
        <Skeleton variant="text" width="70%" height={20} />

        <Skeleton variant="text" width="60%" height={20} />

        <Skeleton variant="text" width="100%" height={20} />

        <Skeleton variant="text" width="60%" height={20} />
      </Box>
    </Box>
  );
}

export default DelegationItemLoader;
