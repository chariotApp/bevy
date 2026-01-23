import { CSSProperties } from "react";

/**
 * Styles for the upgrade page and its components
 */
export const styles = {
  // Container styles
  container: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    padding: "3rem 1.5rem",
  } as CSSProperties,

  innerContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
  } as CSSProperties,

  // Header styles
  headerContainer: {
    textAlign: "center",
    marginBottom: "3rem",
  } as CSSProperties,

  headerContent: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1rem",
  } as CSSProperties,

  headerIcon: {
    background: "linear-gradient(135deg, #448bfc 0%, #2563eb 100%)",
    borderRadius: "12px",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as CSSProperties,

  headerTitle: {
    fontSize: "2.75rem",
    fontWeight: "800",
    margin: 0,
    color: "#0f172a",
  } as CSSProperties,

  // Pricing cards grid
  pricingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "2rem",
    marginBottom: "4rem",
    maxWidth: "900px",
    margin: "0 auto 4rem",
  } as CSSProperties,

  // Free plan card
  freePlanCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "2.5rem 2rem",
    border: "2px solid #e2e8f0",
    position: "relative",
    transition: "all 0.3s ease",
  } as CSSProperties,

  freePlanBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#f1f5f9",
    borderRadius: "8px",
    marginBottom: "1rem",
  } as CSSProperties,

  freePlanBadgeText: {
    fontSize: "0.875rem",
    fontWeight: "700",
    color: "#475569",
  } as CSSProperties,

  planTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    color: "#0f172a",
  } as CSSProperties,

  priceContainer: {
    marginBottom: "1rem",
  } as CSSProperties,

  priceAmount: {
    fontSize: "3.5rem",
    fontWeight: "800",
    color: "#0f172a",
  } as CSSProperties,

  priceAmountPremium: {
    fontSize: "3.5rem",
    fontWeight: "800",
    color: "#448bfc",
  } as CSSProperties,

  priceInterval: {
    fontSize: "1.125rem",
    color: "#64748b",
  } as CSSProperties,

  planDescription: {
    color: "#64748b",
    marginBottom: "2rem",
    lineHeight: "1.5",
  } as CSSProperties,

  currentPlanButton: {
    width: "100%",
    padding: "1rem",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    color: "#94a3b8",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "not-allowed",
  } as CSSProperties,

  // Premium plan card
  premiumPlanCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "2.5rem 2rem",
    border: "3px solid #448bfc",
    position: "relative",
    boxShadow: "0 20px 60px rgba(68, 139, 252, 0.25)",
    transform: "scale(1.05)",
  } as CSSProperties,

  recommendedBadge: {
    position: "absolute",
    top: "-14px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(135deg, #448bfc 0%, #2563eb 100%)",
    color: "#ffffff",
    padding: "0.5rem 1.5rem",
    borderRadius: "20px",
    fontSize: "0.875rem",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    boxShadow: "0 4px 12px rgba(68, 139, 252, 0.4)",
  } as CSSProperties,

  premiumBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    borderRadius: "8px",
    marginBottom: "1rem",
    marginTop: "0.5rem",
  } as CSSProperties,

  premiumBadgeText: {
    fontSize: "0.875rem",
    fontWeight: "700",
    color: "#448bfc",
  } as CSSProperties,

  upgradeButton: {
    width: "100%",
    padding: "1rem",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #448bfc 0%, #2563eb 100%)",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(68, 139, 252, 0.3)",
  } as CSSProperties,

  upgradeButtonLoading: {
    width: "100%",
    padding: "1rem",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "not-allowed",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(68, 139, 252, 0.3)",
  } as CSSProperties,

  // Feature comparison table
  featureTableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "2.5rem 2rem",
    boxShadow: "0 4px 20px rgba(15, 23, 42, 0.08)",
    border: "1px solid #f1f5f9",
  } as CSSProperties,

  featureTableTitle: {
    fontSize: "2rem",
    fontWeight: "800",
    marginBottom: "0.5rem",
    textAlign: "center",
    color: "#0f172a",
  } as CSSProperties,

  featureTableSubtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: "2.5rem",
    fontSize: "1.05rem",
  } as CSSProperties,

  tableWrapper: {
    overflowX: "auto",
  } as CSSProperties,

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 4px",
  } as CSSProperties,

  tableHeaderCell: {
    textAlign: "left",
    padding: "1.25rem 1rem",
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  } as CSSProperties,

  tableHeaderCellCenter: {
    textAlign: "center",
    padding: "1.25rem 1rem",
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#475569",
    width: "180px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  } as CSSProperties,

  tableHeaderCellPremium: {
    textAlign: "center",
    padding: "1.25rem 1rem",
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#448bfc",
    width: "180px",
    backgroundColor: "#f0f9ff",
    borderRadius: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  } as CSSProperties,

  tableRow: {
    transition: "all 0.2s ease",
  } as CSSProperties,

  tableCell: (isFirstRow: boolean) => ({
    padding: "1.125rem 1rem",
    fontSize: "0.975rem",
    color: "#334155",
    fontWeight: "500",
    borderTop: isFirstRow ? "none" : "1px solid #f1f5f9",
    borderBottom: "1px solid #f1f5f9",
  } as CSSProperties),

  tableCellCenter: (isFirstRow: boolean) => ({
    textAlign: "center",
    padding: "1.125rem 1rem",
    borderTop: isFirstRow ? "none" : "1px solid #f1f5f9",
    borderBottom: "1px solid #f1f5f9",
  } as CSSProperties),

  tableCellPremium: (isFirstRow: boolean) => ({
    textAlign: "center",
    padding: "1.125rem 1rem",
    backgroundColor: "#fafcff",
    borderTop: isFirstRow ? "none" : "1px solid #e0f2fe",
    borderBottom: "1px solid #e0f2fe",
  } as CSSProperties),

  checkIconContainer: {
    display: "flex",
    justifyContent: "center",
  } as CSSProperties,

  checkIconBadge: {
    backgroundColor: "#dcfce7",
    borderRadius: "50%",
    padding: "0.375rem",
    display: "inline-flex",
  } as CSSProperties,

  xIconBadge: {
    backgroundColor: "#fee2e2",
    borderRadius: "50%",
    padding: "0.375rem",
    display: "inline-flex",
  } as CSSProperties,

  premiumCheckIconBadge: {
    background: "linear-gradient(135deg, #448bfc 0%, #2563eb 100%)",
    borderRadius: "50%",
    padding: "0.375rem",
    display: "inline-flex",
    boxShadow: "0 2px 8px rgba(68, 139, 252, 0.25)",
  } as CSSProperties,

  featureText: {
    fontSize: "0.9rem",
    color: "#64748b",
    fontWeight: "500",
  } as CSSProperties,

  featureTextPremium: {
    fontSize: "0.9rem",
    color: "#448bfc",
    fontWeight: "700",
  } as CSSProperties,

  // CTA section
  ctaSection: {
    marginTop: "3rem",
    textAlign: "center",
    padding: "3.5rem 2rem",
    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    borderRadius: "20px",
    border: "2px solid #bfdbfe",
  } as CSSProperties,

  ctaIconContainer: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.5rem",
  } as CSSProperties,

  ctaIcon: {
    background: "linear-gradient(135deg, #448bfc 0%, #2563eb 100%)",
    borderRadius: "50%",
    padding: "1rem",
    boxShadow: "0 8px 20px rgba(68, 139, 252, 0.3)",
  } as CSSProperties,

  ctaTitle: {
    fontSize: "2rem",
    fontWeight: "800",
    marginBottom: "0.75rem",
    color: "#0f172a",
  } as CSSProperties,

  ctaDescription: {
    color: "#475569",
    marginBottom: "2rem",
    fontSize: "1.125rem",
    maxWidth: "600px",
    margin: "0 auto 2rem",
    lineHeight: "1.6",
  } as CSSProperties,

  ctaButton: {
    padding: "1.125rem 3rem",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #448bfc 0%, #2563eb 100%)",
    color: "#ffffff",
    fontSize: "1.125rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 20px rgba(68, 139, 252, 0.35)",
  } as CSSProperties,

  ctaButtonLoading: {
    padding: "1.125rem 3rem",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
    color: "#ffffff",
    fontSize: "1.125rem",
    fontWeight: "700",
    cursor: "not-allowed",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 20px rgba(68, 139, 252, 0.35)",
  } as CSSProperties,
};