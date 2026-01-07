"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import AdminSidebar from "@/components/AdminSidebar";

type Member = {
  id: string;
  full_name: string | null;
  role: string;
};

export default function OrganizationPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;

  const [orgName, setOrgName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Organization
      const { data: org } = await supabase
        .from("organizations")
        .select("name, invite_code")
        .eq("id", organizationId)
        .single();

      if (!org) return;

      setOrgName(org.name);
      setInviteCode(org.invite_code);

      // Memberships
      const { data: memberships } = await supabase
        .from("organization_memberships")
        .select("user_id, role")
        .eq("organization_id", organizationId);

      if (!memberships) return;

      // Is current user admin?
      const myMembership = memberships.find(
        (m) => m.user_id === user.id
      );
      setIsAdmin(myMembership?.role === "admin");

      // Profiles
      const userIds = memberships.map((m) => m.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      const mappedMembers: Member[] = memberships.map((m) => {
        const profile = profiles?.find((p) => p.id === m.user_id);
        return {
          id: m.user_id,
          full_name: profile?.full_name || "Unnamed User",
          role: m.role,
        };
      });

      setMembers(mappedMembers);
      setLoading(false);
    };

    fetchOrganization();
  }, [supabase, router, organizationId]);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading organization...</p>;
  }

  return (
    <>
      {/* Admin Sidebar */}
      {isAdmin && <AdminSidebar organizationId={organizationId} />}

      {/* Page Content */}
      <div
        style={{
          padding: "2rem",
          maxWidth: "900px",
          margin: "0 auto",
          marginLeft: isAdmin ? "72px" : "0", // shift for sidebar
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 600 }}>
              {orgName}
            </h1>
            <p style={{ color: "#666" }}>Organization Members</p>
          </div>

          {isAdmin && (
            <Button onClick={async () => {
              await navigator.clipboard.writeText(inviteCode);
              alert("Invite code copied!");
            }}>
              Copy Invite Code
            </Button>
          )}
        </div>

        {/* Members */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {members.map((member) => (
            <div
              key={member.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
                borderBottom: "1px solid #eee",
              }}
            >
              <p style={{ fontWeight: 500 }}>
                {member.full_name}
              </p>

              <span
                style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  backgroundColor:
                    member.role === "admin" ? "#6b46c1" : "#e5e7eb",
                  color:
                    member.role === "admin" ? "#fff" : "#374151",
                }}
              >
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
