"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import AdminSidebar from "@/components/AdminSidebar";

type Member = {
  id: string;
  membership_id: string;
  full_name: string | null;
  role: string;
  payment_class: string;
};

type PaymentClass = {
  class_name: string;
  display_name: string;
  dues_amount: number;
};

export default function OrganizationPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;

  const [orgName, setOrgName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [paymentClasses, setPaymentClasses] = useState<PaymentClass[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    membershipId: string;
    memberName: string;
    newClass: string;
    newClassName: string;
  } | null>(null);

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

      // Memberships with payment classes
      const { data: memberships } = await supabase
        .from("organization_memberships")
        .select("id, user_id, role, payment_class")
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
          membership_id: m.id,
          full_name: profile?.full_name || "Unnamed User",
          role: m.role,
          payment_class: m.payment_class || "general_member",
        };
      });

      setMembers(mappedMembers);

      // Fetch payment classes
      const { data: classesData } = await supabase
        .from("organization_payment_classes")
        .select("class_name, display_name, dues_amount")
        .eq("organization_id", organizationId)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (classesData) {
        setPaymentClasses(classesData);
      }

      setLoading(false);
    };

    fetchOrganization();
  }, [supabase, router, organizationId]);

  const handlePaymentClassChange = (
    membershipId: string,
    memberName: string,
    newClass: string
  ) => {
    const paymentClass = paymentClasses.find((pc) => pc.class_name === newClass);
    setConfirmDialog({
      show: true,
      membershipId,
      memberName,
      newClass,
      newClassName: paymentClass?.display_name || newClass,
    });
  };

  const confirmPaymentClassChange = async () => {
    if (!confirmDialog) return;

    console.log("Payment class change initiated");

    const { error } = await supabase
      .from("organization_memberships")
      .update({ payment_class: confirmDialog.newClass })
      .eq("id", confirmDialog.membershipId);

    if (error) {
      console.error("Error updating payment class:", error);
      alert("Failed to update payment class");
    } else {
      setMembers((prev) =>
        prev.map((m) =>
          m.membership_id === confirmDialog.membershipId
            ? { ...m, payment_class: confirmDialog.newClass }
            : m
        )
      );
    }

    setConfirmDialog(null);
  };

  const getPaymentClassDisplay = (className: string) => {
    const pc = paymentClasses.find((p) => p.class_name === className);
    return pc?.display_name || className;
  };

  const handleCopyInviteCode = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          backgroundColor: "white",
          padding: "2rem 3rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          color: "#64748b",
          fontSize: "1.125rem"
        }}>
          Loading organization...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Admin Sidebar */}
      {isAdmin && <AdminSidebar organizationId={organizationId} />}

      {/* Confirmation Dialog */}
      {confirmDialog && confirmDialog.show && (
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
            animation: "fadeIn 0.2s ease-out"
          }}
          onClick={() => setConfirmDialog(null)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "16px",
              maxWidth: "440px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
              animation: "slideUp 0.3s ease-out"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#eff6ff",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.25rem",
              color: "#448bfc",
              fontSize: "1.5rem"
            }}>
              ⚠️
            </div>
            <h2 style={{ 
              fontSize: "1.5rem", 
              fontWeight: 700, 
              marginBottom: "0.75rem",
              color: "#1e293b"
            }}>
              Confirm Payment Class Change
            </h2>
            <p style={{ 
              color: "#64748b", 
              marginBottom: "1.5rem",
              lineHeight: "1.6"
            }}>
              Are you sure you want to change <strong style={{ color: "#1e293b" }}>{confirmDialog.memberName}</strong>'s
              payment class to <strong style={{ color: "#448bfc" }}>{confirmDialog.newClassName}</strong>?
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setConfirmDialog(null)}
                style={{
                  padding: "0.625rem 1.25rem",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "white",
                  cursor: "pointer",
                  fontWeight: 500,
                  color: "#64748b",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmPaymentClassChange}
                style={{
                  padding: "0.625rem 1.25rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#448bfc",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  boxShadow: "0 2px 8px rgba(68, 139, 252, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3378e8";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(68, 139, 252, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#448bfc";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(68, 139, 252, 0.3)";
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
          padding: "3rem 2rem",
          marginLeft: isAdmin ? "72px" : "0",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "2.5rem",
              gap: "2rem"
            }}
          >
            <div>
              <h1 style={{ 
                fontSize: "2.5rem", 
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: "0.5rem"
              }}>
                {orgName}
              </h1>
              <p style={{ 
                color: "#64748b",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <span>👥</span>
                {members.length} {members.length === 1 ? 'member' : 'members'}
              </p>
            </div>

            {isAdmin && (
              <Button 
                onClick={handleCopyInviteCode}
                style={{
                  backgroundColor: copiedCode ? "#10b981" : "#448bfc",
                  color: "white",
                  fontWeight: 500,
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  transition: "all 0.3s",
                  boxShadow: copiedCode 
                    ? "0 4px 12px rgba(16, 185, 129, 0.3)" 
                    : "0 4px 12px rgba(68, 139, 252, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                {copiedCode ? "✓ Copied!" : "📋 Copy Invite Code"}
              </Button>
            )}
          </div>

          {/* Members Card */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
            }}
          >
            {/* Table Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem 1.5rem",
              backgroundColor: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              <span style={{ flex: 1 }}>Member</span>
              <span style={{ width: "200px", textAlign: "center" }}>Payment Class</span>
              <span style={{ width: "100px", textAlign: "center" }}>Role</span>
            </div>

            {/* Members List */}
            {members.map((member, index) => (
              <div
                key={member.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1.25rem 1.5rem",
                  borderBottom: index < members.length - 1 ? "1px solid #f1f5f9" : "none",
                  gap: "1rem",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {/* Member Name with Avatar */}
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "1rem",
                  flex: 1 
                }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#eff6ff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#448bfc",
                    fontSize: "1rem",
                    fontWeight: 600
                  }}>
                    {(member.full_name || "U").charAt(0).toUpperCase()}
                  </div>
                  <p style={{ 
                    fontWeight: 500,
                    color: "#1e293b",
                    fontSize: "0.95rem"
                  }}>
                    {member.full_name}
                  </p>
                </div>

                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "1rem",
                  justifyContent: "flex-end"
                }}>
                  {/* Payment Class Selector */}
                  {isAdmin ? (
                    <select
                      value={member.payment_class}
                      onChange={(e) =>
                        handlePaymentClassChange(
                          member.membership_id,
                          member.full_name || "Member",
                          e.target.value
                        )
                      }
                      style={{
                        padding: "0.5rem 0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.875rem",
                        backgroundColor: "white",
                        cursor: "pointer",
                        minWidth: "160px",
                        fontWeight: 500,
                        color: "#475569",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#448bfc";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                      }}
                    >
                      {paymentClasses.map((pc) => (
                        <option key={pc.class_name} value={pc.class_name}>
                          {pc.display_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        backgroundColor: "#f1f5f9",
                        color: "#475569",
                        minWidth: "160px",
                        textAlign: "center"
                      }}
                    >
                      {getPaymentClassDisplay(member.payment_class)}
                    </span>
                  )}

                  {/* Role Badge */}
                  <span
                    style={{
                      padding: "0.375rem 0.875rem",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      backgroundColor:
                        member.role === "admin" ? "#448bfc" : "#f1f5f9",
                      color:
                        member.role === "admin" ? "#fff" : "#64748b",
                      textTransform: "capitalize",
                      letterSpacing: "0.025em",
                      minWidth: "80px",
                      textAlign: "center"
                    }}
                  >
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
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