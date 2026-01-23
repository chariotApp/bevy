// src/hooks/useTreasury.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type Member = {
  id: string;
  full_name: string | null;
  payment_class: string;
};

export type PaymentClass = {
  id: string;
  class_name: string;
  display_name: string;
  dues_amount: number;
  billing_frequency: string;
  is_active: boolean;
};

export function useTreasury(organizationId: string) {
  const supabase = createClient();
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [paymentClasses, setPaymentClasses] = useState<PaymentClass[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Fetch payment classes
      const { data: classes, error: classesError } = await supabase
        .from("organization_payment_classes")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("is_active", true);

      if (classesError) {
        throw new Error(`Error fetching payment classes: ${classesError.message}`);
      }

      setPaymentClasses(classes || []);

      // Fetch memberships
      const { data: memberships, error: membershipError } = await supabase
        .from("organization_memberships")
        .select("user_id, role, payment_class")
        .eq("organization_id", organizationId);

      if (membershipError) {
        throw new Error(`Error fetching memberships: ${membershipError.message}`);
      }

      if (!memberships) {
        setLoading(false);
        return;
      }

      // Check admin status
      const myMembership = memberships.find((m) => m.user_id === user.id);
      const userIsAdmin = myMembership?.role === "admin";
      setIsAdmin(userIsAdmin);

      // Redirect non-admins
      if (!userIsAdmin) {
        router.push(`/organizations/${organizationId}/treasury/my-balance`);
        return;
      }

      const userIds = memberships.map((m) => m.user_id);

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      if (profilesError) {
        throw new Error(`Error fetching profiles: ${profilesError.message}`);
      }

      if (profiles) {
        setMembers(
          profiles.map((p) => {
            const membership = memberships.find((m) => m.user_id === p.id);
            return {
              id: p.id,
              full_name: p.full_name || "Unnamed User",
              payment_class: membership?.payment_class || "general_member",
            };
          })
        );
      }

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
    members,
    paymentClasses,
    isAdmin,
    loading,
    error,
    refetch: fetchData,
  };
}