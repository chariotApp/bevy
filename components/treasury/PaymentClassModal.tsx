// src/components/treasury/PaymentClassModal.tsx (Updated)
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal, ModalBody } from "@/components/ui/Modal";
import { PaymentClass } from "@/hooks/useTreasury";
import { usePaymentClasses } from "@/hooks/usePaymentClasses";
import { PaymentClassForm } from "./PaymentClassForm";
import { PaymentClassList } from "./PaymentClassList";
import { validatePaymentClassForm } from "@/lib/utils/treasury";

interface PaymentClassModalProps {
  organizationId: string;
  paymentClasses: PaymentClass[];
  onClose: () => void;
}

export function PaymentClassModal({
  organizationId,
  paymentClasses,
  onClose,
}: PaymentClassModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [formDisplayName, setFormDisplayName] = useState("");
  const [formDuesAmount, setFormDuesAmount] = useState("");
  const [formBillingFrequency, setFormBillingFrequency] = useState("semester");
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const { addPaymentClass, updatePaymentClass, submitting } =
    usePaymentClasses(organizationId, () => {
      resetForm();
      onClose();
    });

  const resetForm = () => {
    setFormDisplayName("");
    setFormDuesAmount("");
    setFormBillingFrequency("semester");
    setEditingClassId(null);
    setShowAddForm(false);
    setFormErrors([]);
  };

  const handleAdd = async () => {
    // Validate form
    const errors = validatePaymentClassForm({
      displayName: formDisplayName,
      duesAmount: formDuesAmount,
      billingFrequency: formBillingFrequency,
    });

    if (errors.length > 0) {
      setFormErrors(errors.map((e) => e.message));
      return;
    }

    setFormErrors([]);

    try {
      await addPaymentClass(
        formDisplayName,
        formDuesAmount,
        formBillingFrequency
      );
    } catch (error) {
      setFormErrors([
        error instanceof Error ? error.message : "Failed to create payment class",
      ]);
    }
  };

  const handleUpdate = async () => {
    if (!editingClassId) return;

    // Validate form
    const errors = validatePaymentClassForm({
      displayName: formDisplayName,
      duesAmount: formDuesAmount,
      billingFrequency: formBillingFrequency,
    });

    if (errors.length > 0) {
      setFormErrors(errors.map((e) => e.message));
      return;
    }

    setFormErrors([]);

    try {
      await updatePaymentClass(
        editingClassId,
        formDisplayName,
        formDuesAmount,
        formBillingFrequency
      );
    } catch (error) {
      setFormErrors([
        error instanceof Error ? error.message : "Failed to update payment class",
      ]);
    }
  };

  const startEditing = (paymentClass: PaymentClass) => {
    setEditingClassId(paymentClass.id);
    setFormDisplayName(paymentClass.display_name);
    setFormDuesAmount(paymentClass.dues_amount.toString());
    setFormBillingFrequency(paymentClass.billing_frequency);
    setShowAddForm(false);
    setFormErrors([]);
  };

  const editingClass = paymentClasses.find((pc) => pc.id === editingClassId);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Manage Payment Classes"
      size="lg"
    >
      <ModalBody>
        {/* Error Messages */}
        {formErrors.length > 0 && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            {formErrors.map((error, index) => (
              <p
                key={index}
                style={{
                  color: "#dc2626",
                  fontSize: "0.875rem",
                  margin: "0.25rem 0",
                }}
              >
                • {error}
              </p>
            ))}
          </div>
        )}

        {/* Add New Class Button */}
        {!showAddForm && !editingClassId && (
          <Button
            onClick={() => setShowAddForm(true)}
            style={{
              width: "100%",
              backgroundColor: "#eff6ff",
              color: "#448bfc",
              fontWeight: 500,
              padding: "0.75rem",
              borderRadius: "8px",
              border: "2px dashed #448bfc",
              marginBottom: "1.5rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#dbeafe";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#eff6ff";
            }}
          >
            ➕ Add New Payment Class
          </Button>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div style={{ marginBottom: "1.5rem" }}>
            <PaymentClassForm
              displayName={formDisplayName}
              duesAmount={formDuesAmount}
              billingFrequency={formBillingFrequency}
              onDisplayNameChange={setFormDisplayName}
              onDuesAmountChange={setFormDuesAmount}
              onBillingFrequencyChange={setFormBillingFrequency}
              onSubmit={handleAdd}
              onCancel={resetForm}
              submitting={submitting}
            />
          </div>
        )}

        {/* Edit Form */}
        {editingClass && (
          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: "1rem",
                marginTop: 0,
              }}
            >
              Editing: {editingClass.display_name}
            </h3>
            <PaymentClassForm
              displayName={formDisplayName}
              duesAmount={formDuesAmount}
              billingFrequency={formBillingFrequency}
              onDisplayNameChange={setFormDisplayName}
              onDuesAmountChange={setFormDuesAmount}
              onBillingFrequencyChange={setFormBillingFrequency}
              onSubmit={handleUpdate}
              onCancel={resetForm}
              submitting={submitting}
              isEdit
            />
          </div>
        )}

        {/* Payment Classes List */}
        {!showAddForm && !editingClassId && (
          <PaymentClassList
            paymentClasses={paymentClasses}
            onEdit={startEditing}
          />
        )}
      </ModalBody>
    </Modal>
  );
}