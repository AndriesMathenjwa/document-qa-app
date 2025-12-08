import React from 'react'
import { useDocumentContext } from '../context/DocumentContext'

export default function DocumentList() {
  const { documents, selectedDocumentId, setSelectedDocumentId } = useDocumentContext()

  return (
    <div>
      <h3 style={{ marginBottom: 10 }}>Documents</h3>

      {documents.length === 0 && (
        <div style={{ opacity: 0.6 }}>No documents yet</div>
      )}

      {documents.map((d) => {
        const selected = selectedDocumentId === d.id

        return (
          <div
            key={d.id}
            onClick={() => setSelectedDocumentId(d.id)}
            style={{
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "12px",
              background: selected ? "#4f3df5" : "#ffffff",
              color: selected ? "white" : "#333",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "0.25s"
            }}
          >
            <div style={{ fontWeight: 600 }}>{d.name}</div>
            <div style={{ opacity: 0.8 }}>
              {d.status} — {Math.round(d.size / 1024)} KB
            </div>

            {d.status === 'uploading' && (
              <div style={{
                background: "rgba(255,255,255,0.3)",
                height: 6,
                borderRadius: 4,
                marginTop: 8
              }}>
                <div style={{
                  height: "100%",
                  width: `${d.progress ?? 0}%`,
                  background: selected ? "#fff" : "#4f3df5",
                  borderRadius: 4,
                  transition: "0.2s"
                }} />
              </div>
            )}

            {d.status === 'failed' && (
              <div style={{ color: "red", marginTop: 8 }}>Upload failed</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
