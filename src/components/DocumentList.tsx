import React from 'react';
import { useDocumentContext } from '../context/DocumentContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function DocumentList() {
  const { documents, selectedDocumentId, setSelectedDocumentId } = useDocumentContext();

  return (
    <div>
      <h3 style={{ marginBottom: 10 }}>Documents</h3>

      {documents.length === 0 && (
        <div style={{ opacity: 0.6 }}>No documents yet</div>
      )}

      <AnimatePresence>
        {documents.map((d) => {
          const selected = selectedDocumentId === d.id;

          return (
            <motion.div
              key={d.id}
              onClick={() => setSelectedDocumentId(d.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "12px",
                background: selected ? "#4f3df5" : "#ffffff",
                color: selected ? "white" : "#333",
                boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              <div style={{ fontWeight: 600 }}>{d.name}</div>
              <div style={{ opacity: 0.8 }}>
                {d.status} — {Math.round(d.size / 1024)} KB
              </div>

              {d.status === 'uploading' && (
                <motion.div
                  style={{
                    background: "rgba(255,255,255,0.3)",
                    height: 6,
                    borderRadius: 4,
                    marginTop: 8,
                  }}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      width: `${d.progress ?? 0}%`,
                      background: selected ? "#fff" : "#4f3df5",
                      borderRadius: 4,
                    }}
                    animate={{ width: `${d.progress ?? 0}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </motion.div>
              )}

              {d.status === 'failed' && (
                <div style={{ color: "red", marginTop: 8 }}>Upload failed</div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
