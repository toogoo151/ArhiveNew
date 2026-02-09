import { createTheme } from "@mui/material/styles";

export const getDesignTokens = (mode) => ({
    palette: {
        mode,

        ...(mode === "light"
            ? {
                  // LIGHT
                  primary: { main: "#1F618D" },
                  background: {
                      default: "#f5f6fa",
                      paper: "#ffffff",
                  },
              }
            : {
                  // DARK
                  primary: { main: "#5DADE2" },
                  background: {
                      default: "#0f172a",   // page bg
                      paper: "#1e293b",     // cards / tables
                  },
              }),
    },

    shape: {
        borderRadius: 10,
    },

    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },

        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 8,
                },
            },
        },
    },
});
