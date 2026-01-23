// src/hooks/usePaymentClasses.ts
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PaymentClass } from "./useTreasury";

export function usePaymentClasses(organizationId: string, onSuccess?: () => void) {
  const supabase = createClient();
  const [submitting, setSubmitting] = useState(false);

  const addPaymentClass = async (
    displayName: string,
    duesAmount: string,
    billingFrequency: string
  ) => {
    if (!displayName.trim()) {
      throw new Error("Display name is required");
    }

    setSubmitting(true);

    try {
      const className = displayName.toLowerCase().replace(/\s+/g, "_");

      const { error } = await supabase
        .from("organization_payment_classes")
        .insert({
          organization_id: organizationId,
          class_name: className,
          display_name: displayName,
          dues_amount: parseFloat(duesAmount) || 0,
          billing_frequency: billingFrequency,
          is_active: true,
        });

      if (error) {
        throw new Error(`Failed to create payment class: ${error.message}`);
      }

      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  };

  const updatePaymentClass = async (
    classId: string,
    displayName: string,
    duesAmount: string,
    billingFrequency: string
  ) => {
    if (!displayName.trim()) {
      throw new Error("Display name is required");
    }

    setSubmitting(true);

    try {
      const className = displayName.toLowerCase().replace(/\s+/g, "_");

      const { error } = await supabase
        .from("organization_payment_classes")
        .update({
          class_name: className,
          display_name: displayName,
          dues_amount: parseFloat(duesAmount) || 0,
          billing_frequency: billingFrequency,
        })
        .eq("id", classId);

      if (error) {
        throw new Error(`Failed to update payment class: ${error.message}`);
      }

      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  };

  return {
    addPaymentClass,
    updatePaymentClass,
    submitting,
  };
}