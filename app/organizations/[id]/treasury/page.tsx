"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTreasury } from "@/hooks/useTreasury";
import { usePaymentClasses } from "@/hooks/usePaymentClasses";
import { MemberBalanceTable } from "@/components/treasury/MemberBalanceTable";
import { PaymentClassModal } from "@/components/treasury/PaymentClassModal";
import { treasuryStyles } from "@/styles/treasury.styles";

export default function TreasuryPage() {
  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;

  const { members, paymentClasses, isAdmin, loading, refetch } =
    useTreasury(organizationId);

  const [showManageClassesModal, setShowManageClassesModal] = useState(false);

  const handleModalClose = () => {
    setShowManageClassesModal(false);
    refetch();
  };

  if (loading) {
    return (
      <div style={treasuryStyles.loadingContainer}>
        <div style={treasuryStyles.loadingBox}>Loading treasury...</div>
      </div>
    );
  }

  return (
    <div style={treasuryStyles.pageContainer}>
      <div style={treasuryStyles.contentWrapper}>
        {/* Header */}
        <div style={treasuryStyles.header}>
          <div>
            <h1 style={treasuryStyles.title}>
              {isAdmin ? "Treasury Overview" : "My Balance"}
            </h1>
          </div>

          {/* Admin: Action Buttons */}
          {isAdmin && (
            <div style={treasuryStyles.buttonGroup}>
              <Button
                onClick={() => setShowManageClassesModal(true)}
                style={treasuryStyles.primaryButton}
              >
                Manage Payment Classes
              </Button>
              <Button
                onClick={() =>
                  router.push(
                    `/organizations/${organizationId}/treasury/my-balance`
                  )
                }
                style={treasuryStyles.primaryButton}
              >
                View My Balance
              </Button>
            </div>
          )}
        </div>

        {/* Members Balance Table */}
        <MemberBalanceTable
          members={members}
          paymentClasses={paymentClasses}
        />
      </div>

      {/* Manage Payment Classes Modal */}
      {showManageClassesModal && (
        <PaymentClassModal
          organizationId={organizationId}
          paymentClasses={paymentClasses}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}