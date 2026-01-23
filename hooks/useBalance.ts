// src/hooks/useBalance.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  fetchUserProfile,
  checkUserAdminStatus,
  fetchUserFees,
} from "@/lib/supabase/queries/balance";
import { Fee, UserBalance } from "@/types/balance.types";
import { calculateTotalBalance } from "@/lib/utils/balance";

export function useBalance(organizationId: string) {
  const supabase = createClient();
  const router = useRouter();

  const [userBalance, setUserBalance] = useState<UserBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Fetch user profile
      const profile = await fetchUserProfile(supabase, user.id);

      // Check admin status
      const isAdmin = await checkUserAdminStatus(
        supabase,
        organizationId,
        user.id
      );

      // Fetch user fees
      const fees = await fetchUserFees(supabase, organizationId, user.id);

      // Calculate total balance
      const totalBalance = calculateTotalBalance(fees);

      setUserBalance({
        userId: user.id,
        userName: profile?.full_name || "User",
        isAdmin,
        fees,
        totalBalance,
      });

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [organizationId]);

  return {
    userBalance,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for managing fees with placeholder data (temporary until DB is set up)
 */
export function useBalanceWithPlaceholder(organizationId: string) {
  const supabase = createClient();
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Placeholder fees (remove when DB is ready)
  const [fees] = useState<Fee[]>([
    {
      id: "1",
      description: "Monthly Dues - January 2026",
      amount: 50.0,
      date: "2026-01-01",
      status: "pending",
    },
    {
      id: "2",
      description: "Event Registration Fee",
      amount: 25.0,
      date: "2026-01-10",
      status: "pending",
    },
    {
      id: "3",
      description: "Late Payment Fee",
      amount: 10.0,
      date: "2026-01-15",
      status: "pending",
    },
  ]);

  const totalBalance = calculateTotalBalance(fees);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      try {
        // Fetch user profile
        const profile = await fetchUserProfile(supabase, user.id);
        setUserName(profile?.full_name || "User");

        // Check admin status
        const adminStatus = await checkUserAdminStatus(
          supabase,
          organizationId,
          user.id
        );
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [organizationId]);

  return {
    userName,
    isAdmin,
    fees,
    totalBalance,
    loading,
  };
}