import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Reusable loading component with configurable message and progress indicator
 */
const Loading = ({ 
  message = "טוען נתונים...", 
  size = 60, 
  height = "70vh",
  progress = null, // If provided, shows determinate progress
  progressLabel = null // Custom label for progress percentage
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height,
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress 
          size={size} 
          variant={progress !== null ? "determinate" : "indeterminate"}
          value={progress} 
        />
        {(progress !== null || progressLabel) && (
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {progressLabel || `${Math.round(progress)}%`}
            </Typography>
          </Box>
        )}
      </Box>
      {message && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loading;