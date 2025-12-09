import React, { useState } from "react";
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
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import DeleteIcon from "@mui/icons-material/Delete";

export default function App() {
  const { documents, clearAllData } = useDocumentContext();
  const { mode, toggleMode } = useColorMode();
  const [openDialog, setOpenDialog] = useState(false);

  const handleClearStorage = () => {
    clearAllData();
    setOpenDialog(false);
  };

  return (
    <ErrorBoundary>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Header */}
        <AppBar position="static" elevation={3}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Document Q&A
            </Typography>

            <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
              <IconButton color="inherit" onClick={toggleMode} sx={{ mr: 1 }}>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Clear storage button - only shown when there are documents */}
            {documents.length > 0 && (
              <Tooltip title="Clear all data from local storage">
                <IconButton 
                  color="inherit" 
                  onClick={() => setOpenDialog(true)}
                  sx={{ mr: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}

            <Typography>Documents: {documents.length}</Typography>
          </Toolbar>
        </AppBar>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Clear All Data?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will remove:
              <ul>
                <li>All uploaded documents ({documents.length} documents)</li>
                <li>All Q&A history</li>
                <li>All selected document preferences</li>
              </ul>
              This action cannot be undone. Are you sure you want to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleClearStorage} 
              color="error" 
              variant="contained"
              startIcon={<DeleteIcon />}
            >
              Clear All Data
            </Button>
          </DialogActions>
        </Dialog>

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