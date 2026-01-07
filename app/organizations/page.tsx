"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type OrganizationWithRole = {
  id: string;
  name: string;
  created_at: string;
  role: string;
};

export default function OrganizationsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [organizations, setOrganizations] = useState<OrganizationWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("organization_memberships")
        .select(`
          role,
          organization:organizations (
            id,
            name,
            created_at
          )
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching organizations:", error);
      } else {
        const orgs =
          data?.map((row: any) => ({
            id: row.organization.id,
            name: row.organization.name,
            created_at: row.organization.created_at,
            role: row.role,
          })) || [];

        setOrganizations(orgs);
      }

      setLoading(false);
    };

    fetchOrganizations();
  }, [supabase, router]);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading organizations...</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 600 }}>
          Organizations
        </h1>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            variant="outline"
            onClick={() => router.push("/organizations/join")}
          >
            Join Organization
          </Button>

          <Button
            onClick={() => router.push("/organizations/create")}
          >
            Create Organization
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {organizations.length === 0 ? (
        <p style={{ color: "#666" }}>
          You are not part of any organizations yet.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {organizations.map((org) => (
            <div
              key={org.id}
              onClick={() => router.push(`/organizations/${org.id}`)}
              style={{
                padding: "1.25rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "#fff",
                position: "relative",
              }}
            >
              {/* Role badge */}
              <span
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  fontSize: "0.7rem",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "999px",
                  backgroundColor:
                    org.role === "admin" ? "#6b46c1" : "#e5e7eb",
                  color: org.role === "admin" ? "#fff" : "#374151",
                  textTransform: "capitalize",
                  fontWeight: 500,
                }}
              >
                {org.role}
              </span>

              <h2 style={{ fontSize: "1.2rem", fontWeight: 500 }}>
                {org.name}
              </h2>

              <p style={{ fontSize: "0.85rem", color: "#666" }}>
                Created {new Date(org.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
