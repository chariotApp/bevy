// hooks/useAdminGuard.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function useAdminGuard(organizationId: string) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("organization_memberships")
        .select("role")
        .eq("organization_id", organizationId)
        .eq("user_id", user.id)
        .single();

      if (data?.role !== "admin") {
        router.push(`/organizations/${organizationId}/treasury/my-balance`);
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    run();
  }, [organizationId]);

  return { isAdmin, loading };
}
