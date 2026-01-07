"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Member = {
  id: string;
  full_name: string | null;
};

export default function TreasuryPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        // Fetch organization memberships
        const { data: memberships, error: membershipError } = await supabase
          .from("organization_memberships")
          .select("user_id")
          .eq("organization_id", organizationId);

        if (membershipError) {
          console.error("Error fetching memberships:", membershipError);
          setLoading(false);
          return;
        }

        const userIds = memberships?.map((m) => m.user_id).filter(Boolean) || [];

        if (userIds.length === 0) {
          setMembers([]);
          setLoading(false);
          return;
        }

        // Fetch profiles (id + full_name only)
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);

        if (profilesError || !profilesData) {
          console.error("Error fetching profiles:", profilesError);
          setLoading(false);
          return;
        }

        setMembers(
          profilesData.map((p) => ({
            id: p.id,
            full_name: p.full_name || "Unnamed User",
          }))
        );
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [supabase, router, organizationId]);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading treasury...</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "1rem" }}>
        Treasury
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
        All organization members and their balances.
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {members.length === 0 ? (
          <p style={{ padding: "1rem" }}>No members found.</p>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
                borderBottom: "1px solid #eee",
              }}
            >
              <p style={{ fontWeight: 500 }}>{member.full_name}</p>
              <p style={{ fontWeight: 600, color: "#6b46c1" }}>0$</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
