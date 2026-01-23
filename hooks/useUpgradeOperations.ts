import { useState } from "react";
import { upgradeOrganizationToPremium } from "@/lib/supabase/queries/organizations";

export function useUpgradeOperations(
  organizationId: string,
  onSuccess?: () => void
) {
  const [submitting, setSubmitting] = useState(false);

  const upgradeOrganization = async () => {
    setSubmitting(true);
    try {
      await upgradeOrganizationToPremium(organizationId);
      onSuccess?.();
    } catch (error) {
      console.error('Error upgrading organization:', error);
      alert('Failed to upgrade. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    upgradeOrganization,
    submitting,
  };
}