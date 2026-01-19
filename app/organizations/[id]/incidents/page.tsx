"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";

type IncidentReport = {
  id: string;
  title: string;
  description: string;
  incident_date: string;
  location: string | null;
  severity: "low" | "medium" | "high" | "critical";
  status: "pending" | "reviewing" | "resolved" | "dismissed";
  created_at: string;
  reporter_name: string;
};

export default function IncidentsPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;

  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Check if user is admin
      const { data: membership } = await supabase
        .from("organization_memberships")
        .select("role")
        .eq("organization_id", organizationId)
        .eq("user_id", user.id)
        .single();

      const userIsAdmin = membership?.role === "admin";
      setIsAdmin(userIsAdmin);

      // Redirect non-admins to submit page
      if (!userIsAdmin) {
        router.push(`/organizations/${organizationId}/incidents/submit`);
        return;
      }

      // Fetch incident reports
      const { data: reportsData, error } = await supabase
        .from("incident_reports")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching incidents:", error);
      } else if (reportsData) {
        // Fetch reporter names
        const reporterIds = reportsData.map((r) => r.reporter_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", reporterIds);

        const mappedReports = reportsData.map((report) => {
          const profile = profiles?.find((p) => p.id === report.reporter_id);
          return {
            ...report,
            reporter_name: profile?.full_name || "Unknown User",
          };
        });

        setIncidents(mappedReports);
      }

      setLoading(false);
    };

    fetchData();
  }, [supabase, router, organizationId]);

  const handleStatusChange = async (incidentId: string, newStatus: string) => {
    const { error } = await supabase
      .from("incident_reports")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", incidentId);

    if (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
      return;
    }

    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === incidentId ? { ...incident, status: newStatus as any } : incident
      )
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#dc2626";
      case "high":
        return "#ea580c";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#64748b";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "reviewing":
        return "#3b82f6";
      case "resolved":
        return "#10b981";
      case "dismissed":
        return "#64748b";
      default:
        return "#64748b";
    }
  };

  const filteredIncidents =
    filterStatus === "all"
      ? incidents
      : incidents.filter((i) => i.status === filterStatus);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem 3rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            color: "#64748b",
            fontSize: "1.125rem",
          }}
        >
          Loading incident reports...
        </div>
      </div>
    );
  }

  // This should never render for non-admins since they get redirected
  // But keep this as a safety check
  if (!isAdmin) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "3rem 2rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2rem",
            gap: "2rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: "0.5rem",
              }}
            >
              Incident Reports
            </h1>
            <p style={{ color: "#64748b", fontSize: "1rem" }}>
              Review and manage incident reports from your organization
            </p>
          </div>

          <Button
            onClick={() => router.push(`/organizations/${organizationId}/incidents/submit`)}
            style={{
              backgroundColor: "#448bfc",
              color: "white",
              fontWeight: 500,
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              transition: "all 0.3s",
              boxShadow: "0 4px 12px rgba(68, 139, 252, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#3378e8";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#448bfc";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Plus size={18} /> Submit Report
          </Button>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "2rem",
            borderBottom: "2px solid #e2e8f0",
            paddingBottom: "0.5rem",
          }}
        >
          {["all", "pending", "reviewing", "resolved", "dismissed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "6px 6px 0 0",
                border: "none",
                backgroundColor: filterStatus === status ? "#eff6ff" : "transparent",
                color: filterStatus === status ? "#448bfc" : "#64748b",
                fontWeight: filterStatus === status ? 600 : 500,
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (filterStatus !== status) {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }
              }}
              onMouseLeave={(e) => {
                if (filterStatus !== status) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {status} ({status === "all" ? incidents.length : incidents.filter((i) => i.status === status).length})
            </button>
          ))}
        </div>

        {/* Incidents List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredIncidents.length === 0 ? (
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "3rem",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#64748b", fontSize: "1.125rem" }}>
                No {filterStatus !== "all" ? filterStatus : ""} incident reports found
              </p>
            </div>
          ) : (
            filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "#1e293b",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {incident.title}
                    </h3>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                        {new Date(incident.incident_date).toLocaleDateString()}
                      </span>
                      {incident.location && (
                        <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                          {incident.location}
                        </span>
                      )}
                      <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                        {incident.reporter_name}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <span
                      style={{
                        padding: "0.375rem 0.875rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        backgroundColor: `${getSeverityColor(incident.severity)}20`,
                        color: getSeverityColor(incident.severity),
                        textTransform: "uppercase",
                        letterSpacing: "0.025em",
                      }}
                    >
                      {incident.severity}
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    color: "#475569",
                    marginBottom: "1rem",
                    lineHeight: "1.6",
                  }}
                >
                  {incident.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "1rem",
                    borderTop: "1px solid #f1f5f9",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: 500 }}>
                      Status:
                    </span>
                    <select
                      value={incident.status}
                      onChange={(e) => handleStatusChange(incident.id, e.target.value)}
                      style={{
                        padding: "0.375rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        backgroundColor: `${getStatusColor(incident.status)}20`,
                        color: getStatusColor(incident.status),
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="resolved">Resolved</option>
                      <option value="dismissed">Dismissed</option>
                    </select>
                  </div>

                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                    Reported {new Date(incident.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}