import React, { useMemo, useState } from "react";
import { useDocumentContext } from "../context/DocumentContext";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export default function QAView() {
  const { documents, selectedDocumentId, qa, askQuestion } =
    useDocumentContext();
  const [q, setQ] = useState("");

  const selectedDoc =
    documents.find((d) => d.id === selectedDocumentId) ?? null;

  const history = useMemo(
    () =>
      qa
        .filter((e) => e.documentId === selectedDocumentId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [qa, selectedDocumentId]
  );

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!selectedDocumentId) return;
    const text = q.trim();
    if (!text) return;
    await askQuestion(selectedDocumentId, text);
    setQ("");
  }

  function exportHistory() {
    if (!selectedDocumentId) return;

    const data = history.map(({ question, answer, createdAt }) => ({
      question,
      answer,
      createdAt,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedDoc?.name ?? "qa_history"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {selectedDoc ? selectedDoc.name : "Select a document"}
      </Typography>

      {/* Question input form with animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box component="form" onSubmit={onSubmit} sx={{ mb: 3 }}>
          <TextField
            label="Ask a question"
            fullWidth
            multiline
            minRows={2}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            disabled={!selectedDoc}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="caption">{q.length} chars</Typography>

            <Button
              type="submit"
              variant="contained"
              disabled={!q.trim() || !selectedDoc}
            >
              Ask
            </Button>
          </Box>
        </Box>
      </motion.div>

      <Divider sx={{ mb: 2 }} />

      {/* Q&A header with Export button on the same line */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="subtitle1">Q&A History</Typography>

        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Button variant="outlined" onClick={exportHistory}>
              Export JSON
            </Button>
          </motion.div>
        )}
      </Box>

      {history.length === 0 && (
        <Typography color="text.secondary" variant="body2">
          No Q&A yet
        </Typography>
      )}
      <AnimatePresence>
        {history.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography>
                <strong>Q:</strong> {h.question}
              </Typography>
              <Typography sx={{ whiteSpace: "pre-wrap", mt: 1 }}>
                <strong>A:</strong> {h.answer}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(h.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          </motion.div>
        ))}
      </AnimatePresence>
    </Paper>
  );
}
