import React, { createContext, useContext, useEffect, useState } from "react";
import { DocumentItem, QAEntry } from "../types";
import { askGemini } from "../lib/gemini";

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
    localStorage.setItem("docs_v1", JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem("qa_v1", JSON.stringify(qa));
  }, [qa]);

  useEffect(() => {
    if (selectedDocumentId)
      localStorage.setItem("selected_doc", selectedDocumentId);
    else localStorage.removeItem("selected_doc");
  }, [selectedDocumentId]);

  const [toasts, setToasts] = useState<string[]>([]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const id = setTimeout(() => {
      setToasts((t) => t.slice(1));
    }, 3000);
    return () => clearTimeout(id);
  }, [toasts]);

  function pushToast(msg: string) {
    setToasts((t) => [...t, msg]);
  }

  function removeToast(index: number) {
    setToasts((t) => t.filter((_, i) => i !== index));
  }

  function addFileAndUpload(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      const fileText = reader.result as string;

      const tempId = `temp-${Date.now()}`;

      const placeholder: DocumentItem = {
        id: tempId,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: "uploaded",
        progress: 100,
        type: file.type,
        content: fileText,
      };

      setDocuments((d) => [placeholder, ...d]);
      pushToast(`Loaded ${file.name}`);
      setSelectedDocumentId(tempId);
    };

    reader.readAsText(file);
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
    pushToast("Sending to Gemini...");

    const doc = documents.find((d) => d.id === documentId);

    if (!doc) {
      setQa((prev) =>
        prev.map((x) =>
          x.id === id ? { ...x, answer: "Error: Document not found" } : x
        )
      );
      return;
    }

    const answer = await askGemini(question, doc.content ?? "");

    const final: QAEntry = {
      ...placeholder,
      id: id + "-final",
      answer,
      createdAt: new Date().toISOString(),
    };

    setQa((qarr) => [final, ...qarr.filter((x) => x.id !== id)]);
    pushToast("AI answer ready");
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
