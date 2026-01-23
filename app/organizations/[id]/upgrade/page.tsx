"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUpgradeOperations } from "@/hooks/useUpgradeOperations";
import { UpgradeHeader } from "@/components/upgrade/UpgradeHeader";
import { PricingCards } from "@/components/upgrade/PricingCards";
import { FeatureComparisonTable } from "@/components/upgrade/FeatureComparisonTable";
import { UpgradeCTA } from "@/components/upgrade/UpgradeCTA";

export default function UpgradePage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.organizationId as string;
  
  const { upgradeOrganization, submitting } = useUpgradeOperations(
    organizationId,
    () => router.push(`/organizations/${organizationId}/settings`)
  );

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#ffffff", 
      padding: "3rem 1.5rem" 
    }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto" 
      }}>
        <UpgradeHeader />
        <PricingCards 
          isLoading={submitting} 
          onUpgrade={upgradeOrganization} 
        />
        <FeatureComparisonTable />
        <UpgradeCTA 
          isLoading={submitting} 
          onUpgrade={upgradeOrganization} 
        />
      </div>
    </div>
  );
}