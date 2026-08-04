import { createTheme, PaletteMode } from '@mui/material';

export const getAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#2E7D32', // Organic Green
        light: '#4CAF50',
        dark: '#1B5E20',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#FF9800', // Harvest Orange
        light: '#FFB74D',
        dark: '#F57C00',
        contrastText: '#FFFFFF',
      },
      info: {
        main: '#1976D2',
      },
      success: {
        main: '#43A047',
      },
      warning: {
        main: '#FB8C00',
      },
      error: {
        main: '#E53935',
      },
      background: {
        default: mode === 'light' ? '#F8FAF8' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
      },
      text: {
        primary: mode === 'light' ? '#212121' : '#F5F5F5',
        secondary: mode === 'light' ? '#616161' : '#BDBDBD',
      },
    },
    typography: {
      fontFamily: ['Poppins', 'Roboto', 'Inter', 'sans-serif'].join(','),
      h1: {
        fontSize: '2rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '1.65rem',
        fontWeight: 700,
      },
      h3: {
        fontSize: '1.35rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.15rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '0.9rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '0.95rem',
      },
      body2: {
        fontSize: '0.85rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              mode === 'light'
                ? '0 4px 12px rgba(0, 0, 0, 0.05)'
                : '0 4px 12px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow:
                mode === 'light'
                  ? '0 8px 24px rgba(46, 125, 50, 0.12)'
                  : '0 8px 24px rgba(0, 0, 0, 0.5)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '8px 20px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 600,
          },
        },
      },
    },
  });
