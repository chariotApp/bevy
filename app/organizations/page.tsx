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
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
      padding: "3rem 2rem"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "3rem",
          }}
        >
          <div>
            <h1 style={{ 
              fontSize: "2.5rem", 
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: "0.5rem"
            }}>
              Your Organizations
            </h1>
            <p style={{ color: "#64748b", fontSize: "1rem" }}>
              Manage and access your workspaces
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              variant="outline"
              onClick={() => router.push("/organizations/join")}
              style={{
                borderColor: "#448bfc",
                color: "#448bfc",
                backgroundColor: "white",
                fontWeight: 500,
                padding: "0.625rem 1.25rem",
                borderRadius: "8px",
                transition: "all 0.2s"
              }}
            >
              Join Organization
            </Button>

            <Button
              onClick={() => router.push("/organizations/create")}
              style={{
                backgroundColor: "#448bfc",
                color: "white",
                fontWeight: 500,
                padding: "0.625rem 1.25rem",
                borderRadius: "8px",
                border: "none",
                transition: "all 0.2s",
                boxShadow: "0 4px 12px rgba(68, 139, 252, 0.3)"
              }}
            >
              Create Organization
            </Button>
          </div>
        </div>

        {/* Empty state */}
        {organizations.length === 0 ? (
          <div style={{
            backgroundColor: "white",
            padding: "4rem 2rem",
            borderRadius: "16px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#eff6ff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              color: "#448bfc",
              fontSize: "2rem"
            }}>
              🏢
            </div>
            <p style={{ 
              color: "#64748b",
              fontSize: "1.125rem",
              marginBottom: "0.5rem"
            }}>
              You're not part of any organizations yet
            </p>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Create a new organization or join an existing one to get started
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {organizations.map((org) => (
              <div
                key={org.id}
                onClick={() => router.push(`/organizations/${org.id}`)}
                style={{
                  padding: "1.75rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  cursor: "pointer",
                  backgroundColor: "#fff",
                  position: "relative",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(68, 139, 252, 0.15)";
                  e.currentTarget.style.borderColor = "#448bfc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                {/* Role badge */}
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    fontSize: "0.75rem",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "6px",
                    backgroundColor:
                      org.role === "admin" ? "#448bfc" : "#f1f5f9",
                    color: org.role === "admin" ? "#fff" : "#64748b",
                    textTransform: "capitalize",
                    fontWeight: 600,
                    letterSpacing: "0.025em"
                  }}
                >
                  {org.role}
                </span>

                <div style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#eff6ff",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  color: "#448bfc",
                  fontSize: "1.5rem",
                  fontWeight: 600
                }}>
                  {org.name.charAt(0).toUpperCase()}
                </div>

                <h2 style={{ 
                  fontSize: "1.25rem", 
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: "0.5rem",
                  marginRight: "4rem"
                }}>
                  {org.name}
                </h2>

                <p style={{ 
                  fontSize: "0.875rem", 
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem"
                }}>
                  <span>📅</span>
                  Created {new Date(org.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
