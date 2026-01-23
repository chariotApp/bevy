// src/components/balance/BalanceSummary.tsx
import { Button } from "@/components/ui/button";
import { balanceStyles } from "@/styles/balance.styles";
import { getBalanceColor } from "@/lib/utils/balance";

interface BalanceSummaryProps {
  totalBalance: number;
  onPayClick: () => void;
}

export function BalanceSummary({
  totalBalance,
  onPayClick,
}: BalanceSummaryProps) {
  return (
    <div style={balanceStyles.summaryCard}>
      <div style={balanceStyles.summaryContent}>
        <div>
          <p style={balanceStyles.balanceLabel}>Total Balance</p>
          <p
            style={{
              ...balanceStyles.balanceAmount,
              color: getBalanceColor(totalBalance),
            }}
          >
            ${totalBalance.toFixed(2)}
          </p>
        </div>
        <Button
          onClick={onPayClick}
          style={balanceStyles.payButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#3378e8";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(68, 139, 252, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#448bfc";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(68, 139, 252, 0.3)";
          }}
        >
          Pay Now
        </Button>
      </div>
    </div>
  );
}