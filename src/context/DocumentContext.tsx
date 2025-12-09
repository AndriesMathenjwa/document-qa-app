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
  clearAllData: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

const DocumentContext = createContext<DocContext | undefined>(undefined);

function safeSetItem(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function safeRemoveItem(key: string) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

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

  const [searchQuery, setSearchQuery] = useState('');

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

  function clearAllData() {
    setDocuments([]);
    setQa([]);
    setSelectedDocumentId(null);
    safeRemoveItem("docs_v1");
    safeRemoveItem("qa_v1");
    safeRemoveItem("selected_doc");
    pushToast("All data cleared from local storage");
  }

  useEffect(() => {
    if (!safeSetItem("docs_v1", documents)) {
      pushToast("Storage full — document list not saved.");
    }
  }, [documents]);

  useEffect(() => {
    if (!safeSetItem("qa_v1", qa)) {
      pushToast("Storage full — Q&A history not saved.");
    }
  }, [qa]);

  useEffect(() => {
    try {
      if (selectedDocumentId)
        localStorage.setItem("selected_doc", selectedDocumentId);
      else localStorage.removeItem("selected_doc");
    } catch {
      pushToast("Unable to save selected document.");
    }
  }, [selectedDocumentId]);

  function addFileAndUpload(file: File) {
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      pushToast("File too large. Max allowed size is 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const fileText = reader.result as string;
      if (fileText.length > 800000) {
        pushToast("Document is too large to store locally.");
        return;
      }

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
    pushToast("Sending to AI...");

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
    clearAllData,
    searchQuery,
    setSearchQuery,
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
