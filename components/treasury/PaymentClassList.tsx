// src/components/treasury/PaymentClassList.tsx
import { PaymentClass } from "@/hooks/useTreasury";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatBillingFrequency } from "@/lib/utils/treasury";

interface PaymentClassListProps {
  paymentClasses: PaymentClass[];
  onEdit: (paymentClass: PaymentClass) => void;
  onDelete?: (classId: string) => void;
  emptyMessage?: string;
}

interface PaymentClassItemProps {
  paymentClass: PaymentClass;
  onEdit: () => void;
  onDelete?: () => void;
}

export function PaymentClassList({
  paymentClasses,
  onEdit,
  onDelete,
  emptyMessage = "No payment classes yet. Add one to get started!",
}: PaymentClassListProps) {
  if (paymentClasses.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          color: "#64748b",
          padding: "2rem",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          border: "1px dashed #e2e8f0",
        }}
      >
        <p style={{ margin: 0 }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {paymentClasses.map((pc) => (
        <PaymentClassItem
          key={pc.id}
          paymentClass={pc}
          onEdit={() => onEdit(pc)}
          onDelete={onDelete ? () => onDelete(pc.id) : undefined}
        />
      ))}
    </div>
  );
}

function PaymentClassItem({
  paymentClass,
  onEdit,
  onDelete,
}: PaymentClassItemProps) {
  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "1.25rem",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#448bfc";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#1e293b",
              marginBottom: "0.5rem",
            }}
          >
            {paymentClass.display_name}
          </h3>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              fontSize: "0.875rem",
              color: "#64748b",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: 500 }}>
              {formatCurrency(paymentClass.dues_amount)}
            </span>
            <span>•</span>
            <span>{formatBillingFrequency(paymentClass.billing_frequency)}</span>
            {paymentClass.class_name && (
              <>
                <span>•</span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    color: "#94a3b8",
                  }}
                >
                  {paymentClass.class_name}
                </span>
              </>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            onClick={onEdit}
            style={{
              backgroundColor: "#eff6ff",
              color: "#448bfc",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "1px solid #448bfc",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#448bfc";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#eff6ff";
              e.currentTarget.style.color = "#448bfc";
            }}
          >
            Edit
          </Button>

          {onDelete && (
            <Button
              onClick={onDelete}
              style={{
                backgroundColor: "#fef2f2",
                color: "#dc2626",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                border: "1px solid #dc2626",
                fontSize: "0.875rem",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#dc2626";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fef2f2";
                e.currentTarget.style.color = "#dc2626";
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for smaller displays
export function PaymentClassListCompact({
  paymentClasses,
  onEdit,
}: Omit<PaymentClassListProps, "onDelete">) {
  if (paymentClasses.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {paymentClasses.map((pc) => (
        <div
          key={pc.id}
          onClick={() => onEdit(pc)}
          style={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            padding: "0.75rem 1rem",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f8fafc";
            e.currentTarget.style.borderColor = "#448bfc";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
        >
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#1e293b",
            }}
          >
            {pc.display_name}
          </span>
          <span
            style={{
              fontSize: "0.875rem",
              color: "#64748b",
            }}
          >
            {formatCurrency(pc.dues_amount)}
          </span>
        </div>
      ))}
    </div>
  );
}

// Badge version for inline display
export function PaymentClassBadge({
  paymentClass,
  size = "md",
}: {
  paymentClass: PaymentClass;
  size?: "sm" | "md" | "lg";
}) {
  const sizeStyles = {
    sm: {
      padding: "0.25rem 0.5rem",
      fontSize: "0.75rem",
    },
    md: {
      padding: "0.375rem 0.875rem",
      fontSize: "0.875rem",
    },
    lg: {
      padding: "0.5rem 1rem",
      fontSize: "1rem",
    },
  };

  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: "#eff6ff",
        color: "#448bfc",
        fontWeight: 500,
        borderRadius: "6px",
        ...sizeStyles[size],
      }}
    >
      {paymentClass.display_name}
    </span>
  );
}