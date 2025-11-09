import { IconButton, Tooltip } from '@mui/material';
import React from 'react';

import { useTheme } from './providers/ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <IconButton onClick={toggleTheme} color='inherit'>
        {isDarkMode ? '☀️' : '🌙'}
      </IconButton>
    </Tooltip>
  );
};
