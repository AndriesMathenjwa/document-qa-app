import React, { createContext, useContext, useEffect, useState } from "react";
import { DocumentItem, QAEntry } from "../types";
import { simulateUpload, mockAnswer } from "../utils/mockApi";

type DocContext = {
  documents: DocumentItem[];
  qa: QAEntry[];
  selectedDocumentId: string | null;
  setSelectedDocumentId: (id: string | null) => void;
  addFileAndUpload: (file: File) => void;
  askQuestion: (documentId: string, question: string) => Promise<void>;
  pushToast: (message: string) => void;
  toasts: string[];
  removeToast: (index: number) => void;
};

const DocumentContext = createContext<DocContext | undefined>(undefined);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const raw = localStorage.getItem("docs_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [qa, setQa] = useState<QAEntry[]>(() => {
    try {
      const raw = localStorage.getItem("qa_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    () => {
      try {
        return localStorage.getItem("selected_doc") || null;
      } catch {
        return null;
      }
    }
  );

  useEffect(() => {
    try {
      localStorage.setItem("docs_v1", JSON.stringify(documents));
    } catch {}
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem("qa_v1", JSON.stringify(qa));
    } catch {}
  }, [qa]);

  useEffect(() => {
    try {
      if (selectedDocumentId)
        localStorage.setItem("selected_doc", selectedDocumentId);
      else localStorage.removeItem("selected_doc");
    } catch {}
  }, [selectedDocumentId]);

  const [toasts, setToasts] = useState<string[]>([]);
  useEffect(() => {
    if (toasts.length === 0) return;
    const id = setTimeout(() => {
      setToasts((t) => t.slice(1));
    }, 3000);
    return () => clearTimeout(id);
  }, [toasts]);

  function pushToast(message: string) {
    setToasts((t) => [...t, message]);
  }
  function removeToast(index: number) {
    setToasts((t) => t.filter((_, i) => i !== index));
  }

  function addFileAndUpload(file: File) {
    const tempId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)}`;
    const placeholder: DocumentItem = {
      id: tempId,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      status: "uploading",
      progress: 0,
    };
    setDocuments((d) => [placeholder, ...d]);
    simulateUpload(file, (p) => {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === tempId ? { ...doc, progress: p } : doc))
      );
    })
      .then((uploaded) => {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === tempId
              ? { ...uploaded, status: "uploaded", progress: 100 }
              : doc
          )
        );
        pushToast(`Uploaded ${uploaded.name}`);
        setSelectedDocumentId((cur) => cur ?? uploaded.id);
      })
      .catch(() => {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === tempId ? { ...doc, status: "failed" } : doc
          )
        );
        pushToast(`Upload failed: ${file.name}`);
      });
  }

  async function askQuestion(documentId: string, question: string) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const placeholder: QAEntry = {
      id,
      documentId,
      question,
      answer: "Thinking...",
      createdAt: new Date().toISOString(),
    };
    setQa((q) => [placeholder, ...q]);
    pushToast("Question submitted");
    const doc = documents.find((d) => d.id === documentId);
    const answer = await mockAnswer(question, doc?.name ?? "document");
    const final: QAEntry = {
      ...placeholder,
      id: id + "-final",
      answer,
      createdAt: new Date().toISOString(),
    };
    setQa((qarr) => [final, ...qarr.filter((x) => x.id !== id)]);
    pushToast("Answer ready");
  }

  const value: DocContext = {
    documents,
    qa,
    selectedDocumentId,
    setSelectedDocumentId,
    addFileAndUpload,
    askQuestion,
    pushToast,
    toasts,
    removeToast,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocumentContext() {
  const ctx = useContext(DocumentContext);
  if (!ctx)
    throw new Error("useDocumentContext must be used within DocumentProvider");
  return ctx;
}
