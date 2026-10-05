import { createTheme, Theme } from '@mui/material/styles';

// Only theme.ts and chartTheme.ts read these directly. Components use the
// standard palette keys so exposed widgets work outside Budtr's ThemeProvider.
export const neutral = {
  0: '#FFFFFF',
  50: '#F7F8F9', // page background
  100: '#EEF0F2', // wash, gridlines, idle fills
  200: '#E1E5E8', // borders and dividers
  400: '#8A96A0', // decorative only, fails text contrast
  500: '#7B8794', // large decorative text only
  600: '#5F6C77', // muted text, inactive tabs
  700: '#4F5D68', // secondary text
  900: '#172733', // primary
};

export const tabularNums = { fontVariantNumeric: 'tabular-nums' } as const;

const createBudtrTheme = (mode: 'light' | 'dark'): Theme => {
  const isLight = mode === 'light';
  const divider = isLight ? neutral[200] : '#2B3C47';

  return createTheme({
    palette: {
      mode,
      primary: isLight
        ? {
            main: neutral[900],
            light: '#2B3C47',
            dark: '#0F1A22',
            contrastText: '#FFFFFF',
          }
        : {
            main: '#E1E5E8',
            light: '#FFFFFF',
            dark: '#C5CCD2',
            contrastText: neutral[900],
          },
      secondary: {
        main: neutral[600],
        contrastText: '#FFFFFF',
      },
      success: { main: '#16A34A' },
      error: { main: '#DC2626', dark: '#B91C1C' },
      info: { main: '#2563EB' },
      warning: { main: '#D97706' },
      divider,
      background: isLight
        ? { default: neutral[50], paper: neutral[0] }
        : { default: '#0F1A22', paper: '#172733' },
      text: isLight
        ? { primary: neutral[900], secondary: neutral[700] }
        : { primary: '#FFFFFF', secondary: '#B0BEC5' },
    },
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
      h1: {
        fontSize: 28,
        lineHeight: '36px',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h2: { fontSize: 20, lineHeight: '28px', fontWeight: 600 },
      h3: { fontSize: 16, lineHeight: '24px', fontWeight: 600 },
      body1: { fontSize: 14, lineHeight: '20px', fontWeight: 400 },
      body2: { fontSize: 13, lineHeight: '20px', fontWeight: 400 },
      caption: { fontSize: 12, lineHeight: '16px', fontWeight: 500 },
      overline: {
        fontSize: 12,
        lineHeight: '16px',
        fontWeight: 500,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      },
    },
    components: {
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          outlined: ({ theme }) => ({
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 12,
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontWeight: 500,
            '&.MuiChip-sizeSmall': {
              height: 28,
              fontSize: 12,
              borderRadius: 999,
            },
            '&.MuiChip-outlined': {
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
            },
            '&.MuiChip-filledPrimary': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
            '&.MuiChip-filledPrimary:hover': {
              backgroundColor: theme.palette.primary.light,
            },
            '&.Mui-focusVisible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: 2,
            },
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            minHeight: 44,
            borderRadius: 8,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.divider,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: 1,
            },
          }),
        },
      },
      MuiSelect: { defaultProps: { size: 'small' } },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
      },
      MuiButton: {
        defaultProps: { variant: 'contained', disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            minHeight: 44,
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: { minHeight: 0 },
          indicator: { display: 'none' },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: ({ theme }) => ({
            position: 'relative',
            minHeight: 0,
            minWidth: 0,
            padding: '14px 12px',
            textTransform: 'none',
            fontSize: 16,
            lineHeight: '24px',
            fontWeight: 500,
            color: isLight ? neutral[600] : theme.palette.text.secondary,
            gap: 10,
            '& .MuiTab-iconWrapper': { marginRight: 0, marginBottom: 0 },
            '&:hover': { color: theme.palette.text.primary },
            '&.Mui-focusVisible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: -2,
              borderRadius: 4,
            },
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 12,
                right: 12,
                bottom: 0,
                height: 3,
                borderRadius: '3px 3px 0 0',
                backgroundColor: theme.palette.primary.main,
              },
            },
          }),
        },
      },
    },
  });
};

export const budtrTheme = createBudtrTheme('light');
export const budtrDarkTheme = createBudtrTheme('dark');

export default budtrTheme;
