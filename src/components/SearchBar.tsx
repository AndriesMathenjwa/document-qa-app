import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { useDocumentContext } from '../context/DocumentContext';
import { useDebounce } from '../hooks/useDebounce';

export default function SearchBar() {
  const { qa } = useDocumentContext();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const results = qa.filter(r =>
    r.question.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    r.answer.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <TextField
      label="Search Q&A"
      variant="outlined"
      fullWidth
      value={query}
      onChange={e => setQuery(e.target.value)}
      sx={{ mb: 2 }}
    />
  );
}
