import React from "react";
import UploadArea from "./components/UploadArea";
import DocumentList from "./components/DocumentList";
import QAView from "./components/QAView";
import SearchBar from "./components/SearchBar";
import Toasts from "./components/Toast";
import ErrorBoundary from "./components/ErrorBoundary";
import { useDocumentContext } from "./context/DocumentContext";
import { useColorMode } from "./context/ColorModeContext";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function App() {
  const { documents } = useDocumentContext();
  const { mode, toggleMode } = useColorMode();

  return (
    <ErrorBoundary>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Header */}
        <AppBar position="static" elevation={3}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Document Q&A
            </Typography>

            <IconButton color="inherit" onClick={toggleMode} sx={{ mr: 2 }}>
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            <Typography>Documents: {documents.length}</Typography>
          </Toolbar>
        </AppBar>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ p: 2 }}
        >
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "0 0 300px" },
              bgcolor: "sidebar.background",
              borderRadius: 3,
              p: 2,
              boxShadow: 2,
              minHeight: { md: "80vh" },
            }}
          >
            <UploadArea />
            <DocumentList />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ mb: 2, p: 2 }}>
              <SearchBar />
            </Paper>
            <QAView />
          </Box>
        </Stack>

        <Toasts />
      </Box>
    </ErrorBoundary>
  );
}
