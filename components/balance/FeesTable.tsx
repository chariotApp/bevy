// src/components/balance/FeesTable.tsx
import { Fee } from "@/types/balance.types";
import { balanceStyles } from "@/styles/balance.styles";
import {
  formatFeeDate,
  getStatusBadgeColor,
  getBalanceColor,
} from "@/lib/utils/balance";

interface FeesTableProps {
  fees: Fee[];
  onFeeClick?: (fee: Fee) => void;
}

export function FeesTable({ fees, onFeeClick }: FeesTableProps) {
  if (fees.length === 0) {
    return (
      <div style={balanceStyles.feesCard}>
        <p style={balanceStyles.emptyState}>No fees or fines at this time.</p>
      </div>
    );
  }

  return (
    <div style={balanceStyles.feesCard}>
      {/* Table Header */}
      <div style={balanceStyles.tableHeader}>
        <span style={{ flex: 1 }}>Description</span>
        <span style={{ width: "120px", textAlign: "center" }}>Date</span>
        <span style={{ width: "100px", textAlign: "right" }}>Amount</span>
        <span style={{ width: "100px", textAlign: "center" }}>Status</span>
      </div>

      {/* Fees List */}
      {fees.map((fee, index) => {
        const statusColors = getStatusBadgeColor(fee.status);

        return (
          <div
            key={fee.id}
            style={{
              ...balanceStyles.tableRow,
              borderBottom:
                index < fees.length - 1 ? "1px solid #f1f5f9" : "none",
              cursor: onFeeClick ? "pointer" : "default",
            }}
            onClick={() => onFeeClick?.(fee)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8fafc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {/* Description */}
            <p style={balanceStyles.descriptionCell}>{fee.description}</p>

            {/* Date */}
            <p style={balanceStyles.dateCell}>{formatFeeDate(fee.date)}</p>

            {/* Amount */}
            <p
              style={{
                ...balanceStyles.amountCell,
                color: getBalanceColor(fee.amount, fee.status === "pending"),
              }}
            >
              ${fee.amount.toFixed(2)}
            </p>

            {/* Status Badge */}
            <div style={balanceStyles.statusCell}>
              <span
                style={{
                  ...balanceStyles.statusBadge,
                  backgroundColor: statusColors.background,
                  color: statusColors.text,
                }}
              >
                {fee.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}