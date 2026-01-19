"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, X, Search, UserCheck } from "lucide-react";

type Driver = {
  id: string;
  user_id: string;
  full_name: string;
  created_at: string;
};

type Member = {
  id: string;
  full_name: string | null;
};

export default function ChariotPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

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

      setIsAdmin(membership?.role === "admin");

      // Fetch drivers
      const { data: driversData, error: driversError } = await supabase
        .from("chariot_drivers")
        .select("id, user_id, created_at")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (driversError) {
        console.error("Error fetching drivers:", driversError);
      } else if (driversData) {
        // Fetch driver names
        const userIds = driversData.map((d) => d.user_id);
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", userIds);

          const mappedDrivers = driversData.map((driver) => {
            const profile = profiles?.find((p) => p.id === driver.user_id);
            return {
              ...driver,
              full_name: profile?.full_name || "Unknown",
            };
          });

          setDrivers(mappedDrivers);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [supabase, router, organizationId]);

  const fetchMembers = async () => {
    // Fetch all organization members
    const { data: memberships } = await supabase
      .from("organization_memberships")
      .select("user_id")
      .eq("organization_id", organizationId);

    if (!memberships) return;

    const userIds = memberships.map((m) => m.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    if (profiles) {
      setAllMembers(profiles.map(p => ({
        id: p.id,
        full_name: p.full_name || "Unnamed User"
      })));
    }
  };

  const handleOpenAddModal = async () => {
    await fetchMembers();
    setShowAddModal(true);
  };

  const toggleMemberSelection = (memberId: string) => {
    const newSelection = new Set(selectedMembers);
    if (newSelection.has(memberId)) {
      newSelection.delete(memberId);
    } else {
      newSelection.add(memberId);
    }
    setSelectedMembers(newSelection);
  };

  const handleAddDrivers = async () => {
    if (selectedMembers.size === 0) {
      alert("Please select at least one member");
      return;
    }

    setSubmitting(true);

    // Get existing drivers to avoid duplicates
    const existingDriverIds = new Set(drivers.map(d => d.user_id));
    const newDrivers = Array.from(selectedMembers).filter(id => !existingDriverIds.has(id));

    if (newDrivers.length === 0) {
      alert("All selected members are already drivers");
      setSubmitting(false);
      return;
    }

    const driversToInsert = newDrivers.map(userId => ({
      organization_id: organizationId,
      user_id: userId,
    }));

    const { data, error } = await supabase
      .from("chariot_drivers")
      .insert(driversToInsert)
      .select();

    if (error) {
      console.error("Error adding drivers:", error);
      alert("Failed to add drivers");
      setSubmitting(false);
      return;
    }

    // Fetch profiles for new drivers
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", newDrivers);

    const newDriversData = data.map(driver => {
      const profile = profiles?.find(p => p.id === driver.user_id);
      return {
        ...driver,
        full_name: profile?.full_name || "Unknown",
      };
    });

    setDrivers([...newDriversData, ...drivers]);
    setSelectedMembers(new Set());
    setShowAddModal(false);
    setSubmitting(false);
  };

  const handleRemoveDriver = async (driverId: string) => {
    if (!confirm("Are you sure you want to remove this driver?")) return;

    const { error } = await supabase
      .from("chariot_drivers")
      .delete()
      .eq("id", driverId);

    if (error) {
      console.error("Error removing driver:", error);
      alert("Failed to remove driver");
      return;
    }

    setDrivers(drivers.filter(d => d.id !== driverId));
  };

  const filteredMembers = allMembers.filter(member => 
    (member.full_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
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
          Loading Chariot...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Add Drivers Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.2s ease-out",
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
              animation: "slideUp 0.3s ease-out",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.5rem",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Add Drivers
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  padding: "0.25rem",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Search Bar */}
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ position: "relative" }}>
                <Search
                  size={20}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members..."
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 3rem",
                    fontSize: "1rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#448bfc";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(68, 139, 252, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
              {selectedMembers.size > 0 && (
                <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "#448bfc", fontWeight: 500 }}>
                  {selectedMembers.size} member{selectedMembers.size !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            {/* Members List */}
            <div style={{ flex: 1, overflow: "auto", padding: "1rem" }}>
              {filteredMembers.length === 0 ? (
                <p style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
                  No members found
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {filteredMembers.map((member) => {
                    const isSelected = selectedMembers.has(member.id);
                    const isDriver = drivers.some(d => d.user_id === member.id);

                    return (
                      <div
                        key={member.id}
                        onClick={() => !isDriver && toggleMemberSelection(member.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.75rem 1rem",
                          borderRadius: "8px",
                          border: `2px solid ${isSelected ? "#448bfc" : "#e2e8f0"}`,
                          backgroundColor: isSelected ? "#eff6ff" : isDriver ? "#f8fafc" : "white",
                          cursor: isDriver ? "not-allowed" : "pointer",
                          transition: "all 0.2s",
                          opacity: isDriver ? 0.6 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!isDriver) {
                            e.currentTarget.style.borderColor = isSelected ? "#448bfc" : "#cbd5e1";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isDriver) {
                            e.currentTarget.style.borderColor = isSelected ? "#448bfc" : "#e2e8f0";
                          }
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              backgroundColor: "#eff6ff",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#448bfc",
                              fontSize: "0.875rem",
                              fontWeight: 600,
                            }}
                          >
                            {(member.full_name || "U").charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500, color: "#1e293b" }}>
                            {member.full_name || "Unnamed User"}
                          </span>
                        </div>
                        {isDriver ? (
                          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>
                            Already a driver
                          </span>
                        ) : (
                          isSelected && (
                            <UserCheck size={20} color="#448bfc" />
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
                padding: "1.5rem",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <button
                onClick={() => setShowAddModal(false)}
                disabled={submitting}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "white",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontWeight: 500,
                  color: "#64748b",
                  transition: "all 0.2s",
                  opacity: submitting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                    e.currentTarget.style.borderColor = "#cbd5e1";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddDrivers}
                disabled={submitting || selectedMembers.size === 0}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#448bfc",
                  color: "white",
                  cursor: submitting || selectedMembers.size === 0 ? "not-allowed" : "pointer",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  boxShadow: "0 2px 8px rgba(68, 139, 252, 0.3)",
                  opacity: submitting || selectedMembers.size === 0 ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!submitting && selectedMembers.size > 0) {
                    e.currentTarget.style.backgroundColor = "#3378e8";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(68, 139, 252, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#448bfc";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(68, 139, 252, 0.3)";
                }}
              >
                {submitting ? "Adding..." : `Add ${selectedMembers.size > 0 ? selectedMembers.size : ""} Driver${selectedMembers.size !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          minHeight: "100vh",
          background: "#ffffff",
          padding: "2rem 2rem",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "2.5rem",
              gap: "2rem",
              flexWrap: "wrap",
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
                Chariot
              </h1>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "1rem",
                }}
              >
                Manage designated drivers for your organization
              </p>
            </div>

            {/* Add Driver Button - Only for Admins */}
            {isAdmin && (
              <Button
                onClick={handleOpenAddModal}
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
                <Plus size={18} /> Add Drivers
              </Button>
            )}
          </div>

          {/* Drivers List */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                padding: "1rem 1.5rem",
                backgroundColor: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Designated Drivers ({drivers.length})
            </div>
            {drivers.length === 0 ? (
              <p
                style={{
                  padding: "2rem 1.5rem",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                No drivers assigned yet.
              </p>
            ) : (
              drivers.map((driver, index) => (
                <div
                  key={driver.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1.25rem 1.5rem",
                    borderBottom: index < drivers.length - 1 ? "1px solid #f1f5f9" : "none",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#eff6ff",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#448bfc",
                        fontSize: "1rem",
                        fontWeight: 600,
                      }}
                    >
                      {(driver.full_name || "U").charAt(0).toUpperCase()}
                    </div>
                    <p
                      style={{
                        fontWeight: 500,
                        color: "#1e293b",
                        fontSize: "0.95rem",
                      }}
                    >
                      {driver.full_name || "Unknown User"}
                    </p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => handleRemoveDriver(driver.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        border: "1px solid #fecaca",
                        backgroundColor: "white",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#fef2f2";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}