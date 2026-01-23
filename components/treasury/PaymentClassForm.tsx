// src/components/treasury/PaymentClassForm.tsx
import { Button } from "@/components/ui/button";
import { treasuryStyles } from "@/styles/treasury.styles";

interface PaymentClassFormProps {
  displayName: string;
  duesAmount: string;
  billingFrequency: string;
  onDisplayNameChange: (value: string) => void;
  onDuesAmountChange: (value: string) => void;
  onBillingFrequencyChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitting: boolean;
  isEdit?: boolean;
}

export function PaymentClassForm({
  displayName,
  duesAmount,
  billingFrequency,
  onDisplayNameChange,
  onDuesAmountChange,
  onBillingFrequencyChange,
  onSubmit,
  onCancel,
  submitting,
  isEdit = false,
}: PaymentClassFormProps) {
  return (
    <div
      style={{
        backgroundColor: isEdit ? "transparent" : "#f8fafc",
        padding: isEdit ? 0 : "1.5rem",
        borderRadius: isEdit ? 0 : "8px",
        marginBottom: isEdit ? 0 : "1.5rem",
        border: isEdit ? "none" : "1px solid #e2e8f0",
      }}
    >
      {!isEdit && (
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "#1e293b",
            marginBottom: "1rem",
          }}
        >
          New Payment Class
        </h3>
      )}

      <div style={treasuryStyles.formGroup}>
        <div>
          <label style={treasuryStyles.label}>Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            placeholder="e.g., Senior Member"
            style={treasuryStyles.input}
          />
        </div>

        <div>
          <label style={treasuryStyles.label}>Dues Amount</label>
          <input
            type="number"
            step="0.01"
            value={duesAmount}
            onChange={(e) => onDuesAmountChange(e.target.value)}
            placeholder="0.00"
            style={treasuryStyles.input}
          />
        </div>

        <div>
          <label style={treasuryStyles.label}>Billing Frequency</label>
          <select
            value={billingFrequency}
            onChange={(e) => onBillingFrequencyChange(e.target.value)}
            style={treasuryStyles.input}
          >
            <option value="semester">Semester</option>
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
            <option value="one_time">One Time</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button
            onClick={onCancel}
            disabled={submitting}
            style={{
              flex: 1,
              backgroundColor: "#e2e8f0",
              color: "#64748b",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={submitting}
            style={{
              flex: 1,
              backgroundColor: isEdit ? "#448bfc" : "#10b981",
              color: "white",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "none",
            }}
          >
            {submitting
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
              ? "Save Changes"
              : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}