"use client";

import { useParams, useRouter } from "next/navigation";
import { useBalanceWithPlaceholder } from "@/hooks/useBalance";
import { BalanceHeader } from "@/components/balance/BalanceHeader";
import { BalanceSummary } from "@/components/balance/BalanceSummary";
import { FeesTable } from "@/components/balance/FeesTable";
import { LoadingState } from "@/components/LoadingState";
import { balanceStyles } from "@/styles/balance.styles";

export default function MyBalancePage() {
  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;

  const { userName, isAdmin, fees, totalBalance, loading } =
    useBalanceWithPlaceholder(organizationId);

  const handleBackClick = () => {
    router.push(`/organizations/${organizationId}/treasury`);
  };

  const handlePayClick = () => {
    window.open(
      "https://buy.stripe.com/test_9B67sL2Z0gyUgYObtY4F200",
      "_blank"
    );
  };

  if (loading) {
    return <LoadingState message="Loading your balance..." />;
  }

  return (
    <div style={balanceStyles.pageContainer}>
      <div style={balanceStyles.contentWrapper}>
        <BalanceHeader isAdmin={isAdmin} onBackClick={handleBackClick} />

        <BalanceSummary
          totalBalance={totalBalance}
          onPayClick={handlePayClick}
        />

        <FeesTable fees={fees} />
      </div>
    </div>
  );
}