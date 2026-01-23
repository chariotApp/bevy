// src/styles/treasury.styles.ts
import { CSSProperties } from "react";

export const treasuryStyles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#ffffff",
    padding: "3rem 2rem",
  } as CSSProperties,

  contentWrapper: {
    maxWidth: "1000px",
    margin: "0 auto",
  } as CSSProperties,

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "2.5rem",
    gap: "2rem",
  } as CSSProperties,

  title: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "0.5rem",
  } as CSSProperties,

  buttonGroup: {
    display: "flex",
    gap: "1rem",
  } as CSSProperties,

  primaryButton: {
    backgroundColor: "#448bfc",
    color: "white",
    fontWeight: 500,
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    transition: "all 0.3s",
    boxShadow: "0 4px 12px rgba(68, 139, 252, 0.3)",
    cursor: "pointer",
  } as CSSProperties,

  card: {
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  } as CSSProperties,

  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 200px 150px",
    alignItems: "center",
    padding: "1rem 1.5rem",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    fontWeight: 600,
    fontSize: "0.875rem",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  } as CSSProperties,

  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 200px 150px",
    alignItems: "center",
    padding: "1.25rem 1.5rem",
    transition: "background-color 0.2s",
  } as CSSProperties,

  avatar: {
    width: "40px",
    height: "40px",
    backgroundColor: "#eff6ff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#448bfc",
    fontSize: "1rem",
    fontWeight: 600,
  } as CSSProperties,

  badge: {
    display: "inline-block",
    padding: "0.375rem 0.875rem",
    backgroundColor: "#eff6ff",
    color: "#448bfc",
    fontSize: "0.875rem",
    fontWeight: 500,
    borderRadius: "6px",
  } as CSSProperties,

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  } as CSSProperties,

  modalContent: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "2rem",
    width: "90%",
    maxWidth: "700px",
    maxHeight: "80vh",
    overflow: "auto",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  } as CSSProperties,

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  } as CSSProperties,

  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#64748b",
    marginBottom: "0.5rem",
  } as CSSProperties,

  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    fontSize: "1rem",
  } as CSSProperties,

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