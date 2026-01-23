// src/components/balance/BalanceHeader.tsx
import { ArrowLeft } from "lucide-react";
import { balanceStyles } from "@/styles/balance.styles";

interface BalanceHeaderProps {
  isAdmin: boolean;
  onBackClick: () => void;
}

export function BalanceHeader({ isAdmin, onBackClick }: BalanceHeaderProps) {
  return (
    <>
      {/* Back Button for Admins */}
      {isAdmin && (
        <button
          onClick={onBackClick}
          style={balanceStyles.backButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f8fafc";
            e.currentTarget.style.borderColor = "#cbd5e1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
        >
          <ArrowLeft size={16} />
          Back to Treasury Overview
        </button>
      )}

      {/* Header */}
      <div style={balanceStyles.header}>
        <h1 style={balanceStyles.title}>My Balance</h1>
        <p style={balanceStyles.subtitle}>View and manage your dues and fees</p>
      </div>
    </>
  );
}