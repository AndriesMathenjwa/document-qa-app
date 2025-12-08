import { createTheme } from "@mui/material/styles";
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    sidebar: {
      background: string;
    };
  }

  interface PaletteOptions {
    sidebar?: {
      background?: string;
    };
  }
}

//LIGHT THEME
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4f3df5",
    },
    secondary: {
      main: "#ff5c8d",
    },
    background: {
      default: "#f0f2f8",
      paper: "#ffffff",
    },
    sidebar: {
      background: "#eceaff",
    },
  },

  shape: { borderRadius: 14 },

  typography: {
    fontFamily: "'Inter', sans-serif",
    h6: { fontWeight: 700 },
    body1: { fontSize: "0.95rem" },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: "18px",
          boxShadow: "0px 4px 14px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #4f3df5 0%, #a353ff 100%)",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.25)",
        },
      },
    },
  },
});

//DARK THEME
export const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    mode: "dark",

    primary: { main: "#7c6cff" },
    secondary: { main: "#ff80b5" },

    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },

    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
    },

    sidebar: {
      background: "#1a1a24",
    },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
          boxShadow: "0px 4px 16px rgba(0,0,0,0.5)",
        },
      },
    },
  },
});
