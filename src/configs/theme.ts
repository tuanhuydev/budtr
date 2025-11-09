import { createTheme } from '@mui/material/styles';

// Custom primary color palette for budget tracking app
const primaryColors = {
  primary: {
    main: '#2E7D32', // Green for money/finance
    light: '#4CAF50',
    dark: '#1B5E20',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
  },
};

export const budtrTheme = createTheme({
  palette: {
    mode: 'light',
    ...primaryColors,
  },
  components: {
    // Only customize Tabs to match your requirements
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${primaryColors.primary.light}20`,
        },
        indicator: {
          height: 3,
          borderRadius: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          fontWeight: 500,
          minHeight: 48,
          '&.Mui-selected': {
            fontWeight: 700,
            color: primaryColors.primary.main,
          },
          '&:hover': {
            backgroundColor: `${primaryColors.primary.main}08`,
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        disableElevation: true,
      },
    },
  },
});

// Dark theme variant
export const budtrDarkTheme = createTheme({
  ...budtrTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#2E7D32',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
    },
  },
});

export default budtrTheme;
