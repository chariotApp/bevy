  import { CSSProperties } from "react";

export const loadingStyles = {
  // LOADING STATE
  loadingContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as CSSProperties,

  loadingBox: {
    backgroundColor: "white",
    padding: "2rem 3rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    color: "#64748b",
    fontSize: "1.125rem",
  } as CSSProperties,
};