"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "@/components/AdminSidebar";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Fetch memberships (role check + members)
      const { data: memberships, error: membershipError } = await supabase
        .from("organization_memberships")
        .select("user_id, role")
        .eq("organization_id", organizationId);

      if (membershipError || !memberships) {
        console.error("Error fetching memberships:", membershipError);
        setLoading(false);
        return;
      }

      // Is current user admin?
      const myMembership = memberships.find(
        (m) => m.user_id === user.id
      );
      setIsAdmin(myMembership?.role === "admin");

      const userIds = memberships.map((m) => m.user_id);

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      if (profilesError || !profiles) {
        console.error("Error fetching profiles:", profilesError);
        setLoading(false);
        return;
      }

      setMembers(
        profiles.map((p) => ({
          id: p.id,
          full_name: p.full_name || "Unnamed User",
        }))
      );

      setLoading(false);
    };

    fetchData();
  }, [supabase, router, organizationId]);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading treasury...</p>;
  }

  return (
    <>
      {/* Admin Sidebar */}
      {isAdmin && <AdminSidebar organizationId={organizationId} />}

      {/* Page Content */}
      <div
        style={{
          padding: "2rem",
          maxWidth: "800px",
          margin: "0 auto",
          marginLeft: isAdmin ? "180px" : "0", // expanded sidebar width
          transition: "margin-left 0.3s ease",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "1rem" }}>
          Treasury
        </h1>

        <p style={{ color: "var(--color-primary)", marginBottom: "2rem" }}>
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
                <p style={{ fontWeight: 600, color: "var(--color-primary)" }}>$0</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
