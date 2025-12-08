import React, { useRef, useState } from 'react';
import { useDocumentContext } from '../context/DocumentContext';
import { CircularProgress } from '@mui/material';

export default function UploadArea() {
  const { addFileAndUpload, documents } = useDocumentContext();
  const ref = useRef<HTMLInputElement | null>(null);
  const [drag, setDrag] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => addFileAndUpload(file));
  }

  const uploadingCount = documents.filter(d => d.status === 'uploading').length;

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
      style={{
        border: drag ? '2px dashed #4f3df5' : '2px dashed #aaa',
        background: drag ? 'rgba(79,61,245,0.1)' : '#fafafa',
        padding: 22,
        marginBottom: 20,
        borderRadius: 12,
        textAlign: 'center',
        color: '#4f3df5',
        cursor: 'pointer',
        transition: '0.25s',
        position: 'relative'
      }}
    >
      {uploadingCount > 0 && (
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <CircularProgress size={20} />
        </div>
      )}

      <p>
        Drag & drop files here or{' '}
        <button
          style={{
            color: '#4f3df5',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={() => ref.current?.click()}
        >
          browse
        </button>
      </p>

      <input
        ref={ref}
        type="file"
        hidden
        multiple
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
