import { Snackbar, Alert } from "@mui/material";
import { useDocumentContext } from "../context/DocumentContext";

export default function Toasts() {
  const { toasts, removeToast } = useDocumentContext();

  return (
    <>
      {toasts.map((t, i) => (
        <Snackbar
          key={i}
          open
          autoHideDuration={3000}
          onClose={() => removeToast(i)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          sx={{
            mb: 6,
          }}
        >
          <Alert
            onClose={() => removeToast(i)}
            severity="info"
            variant="filled"
            sx={{
              fontSize: "1.1rem",
              fontWeight: "600",
              padding: "14px 18px",
              borderRadius: "12px",
              minWidth: "300px",
              display: "flex",
              justifyContent: "center",
              bgcolor: "#d2cc19ff",
              color: "white",
            }}
          >
            {t}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
