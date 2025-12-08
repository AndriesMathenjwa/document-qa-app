import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../theme/theme";

export const ColorModeContext = createContext({
  mode: "light",
  toggleMode: () => {},
});

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState(() => localStorage.getItem("color_mode") || "light");

  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  useEffect(() => {
    localStorage.setItem("color_mode", mode);
  }, [mode]);

  const theme = useMemo(() => (mode === "light" ? lightTheme : darkTheme), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  return useContext(ColorModeContext);
}
