import React from 'react';
import { TextField } from '@mui/material';
import { useDocumentContext } from '../context/DocumentContext';
import { useDebounce } from '../hooks/useDebounce';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useDocumentContext();
  const debouncedQuery = useDebounce(searchQuery, 300);

  React.useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <TextField
      label="Search Q&A"
      variant="outlined"
      fullWidth
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{ mb: 2 }}
    />
  );
}
