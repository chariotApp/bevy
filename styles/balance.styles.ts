// src/styles/balance.styles.ts
import { CSSProperties } from "react";

export const balanceStyles = {
  // LAYOUT
  pageContainer: {
    minHeight: "100vh",
    background: "#ffffff",
    padding: "3rem 2rem",
  } as CSSProperties,

  contentWrapper: {
    maxWidth: "900px",
    margin: "0 auto",
  } as CSSProperties,

  // HEADER
  header: {
    marginBottom: "2.5rem",
  } as CSSProperties,

  title: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "0.5rem",
  } as CSSProperties,

  subtitle: {
    color: "#64748b",
    fontSize: "1rem",
  } as CSSProperties,

  // BACK BUTTON
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    marginBottom: "1.5rem",
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    color: "#64748b",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.875rem",
    transition: "all 0.2s",
  } as CSSProperties,

  // BALANCE SUMMARY CARD
  summaryCard: {
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  } as CSSProperties,

  summaryContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as CSSProperties,

  balanceLabel: {
    fontSize: "0.875rem",
    color: "#64748b",
    marginBottom: "0.5rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
  } as CSSProperties,

  balanceAmount: {
    fontSize: "3rem",
    fontWeight: 700,
  } as CSSProperties,

  payButton: {
    backgroundColor: "#448bfc",
    color: "white",
    fontWeight: 600,
    padding: "0.875rem 2rem",
    borderRadius: "8px",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 4px 12px rgba(68, 139, 252, 0.3)",
  } as CSSProperties,

  // FEES TABLE
  feesCard: {
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  } as CSSProperties,

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.25rem 1.5rem",
    transition: "background-color 0.2s",
  } as CSSProperties,

  // TABLE CELLS
  descriptionCell: {
    flex: 1,
    fontWeight: 500,
    color: "#1e293b",
    fontSize: "0.95rem",
  } as CSSProperties,

  dateCell: {
    width: "120px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.875rem",
  } as CSSProperties,

  amountCell: {
    width: "100px",
    textAlign: "right",
    fontWeight: 600,
    fontSize: "1rem",
  } as CSSProperties,

  statusCell: {
    width: "100px",
    display: "flex",
    justifyContent: "center",
  } as CSSProperties,

  // STATUS BADGE
  statusBadge: {
    padding: "0.375rem 0.875rem",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "capitalize",
    letterSpacing: "0.025em",
  } as CSSProperties,

  // EMPTY STATE
  emptyState: {
    padding: "2rem 1.5rem",
    textAlign: "center",
    color: "#64748b",
  } as CSSProperties,
};