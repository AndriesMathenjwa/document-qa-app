import React, { useMemo, useState, useRef, useEffect } from "react";
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
  const { documents, selectedDocumentId, qa, askQuestion, searchQuery } =
    useDocumentContext();
  const [q, setQ] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedDoc =
    documents.find((d) => d.id === selectedDocumentId) ?? null;

  const history = useMemo(() => {
    return qa
      .filter((e) => e.documentId === selectedDocumentId)
      .filter(
        (e) =>
          e.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [qa, selectedDocumentId, searchQuery]);

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

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey && e.key.toLowerCase() === "q") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {selectedDoc ? selectedDoc.name : "Select a document"}
      </Typography>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box component="form" onSubmit={onSubmit} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              <strong>Keyboard Shortcuts:</strong> Alt+Q = focus input,
              Ctrl+Enter = submit
            </Typography>
          </Box>
          <TextField
            label="Ask a question"
            fullWidth
            multiline
            minRows={2}
            value={q}
            inputRef={inputRef}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                onSubmit();
              }
            }}
            disabled={!selectedDoc}
          />

          <Box
            sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}
          >
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

      <Divider sx={{ mb: 1 }} />

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
            <Paper
              sx={{ p: 2, mt: 2, borderRadius: 2, backgroundColor: "#f5f5f5" }}
            >
              <Typography sx={{ mb: 1, color: "#111", fontWeight: 600 }}>
                Q: {h.question}
              </Typography>
              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                  backgroundColor: "#e0f7fa",
                  p: 1,
                  borderRadius: 1,
                  color: "#006064",
                  mb: 1,
                }}
              >
                A: {h.answer}
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
