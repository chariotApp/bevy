"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Member = {
  id: string;
  full_name: string | null;
  payment_class: string;
};

type PaymentClass = {
  id: string;
  class_name: string;
  display_name: string;
  dues_amount: number;
  billing_frequency: string;
  is_active: boolean;
};

export default function TreasuryPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;

  const [members, setMembers] = useState<Member[]>([]);
  const [paymentClasses, setPaymentClasses] = useState<PaymentClass[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showManageClassesModal, setShowManageClassesModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  
  // Form state for new/edit payment class
  const [formDisplayName, setFormDisplayName] = useState("");
  const [formDuesAmount, setFormDuesAmount] = useState("");
  const [formBillingFrequency, setFormBillingFrequency] = useState("semester");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
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
      console.error("Error fetching payment classes:", classesError);
    } else {
      setPaymentClasses(classes || []);
    }

    // Fetch memberships (role check + members)
    const { data: memberships, error: membershipError } = await supabase
      .from("organization_memberships")
      .select("user_id, role, payment_class")
      .eq("organization_id", organizationId);

    if (membershipError || !memberships) {
      console.error("Error fetching memberships:", membershipError);
      setLoading(false);
      return;
    }

    // Is current user admin?
    const myMembership = memberships.find((m) => m.user_id === user.id);
    const userIsAdmin = myMembership?.role === "admin";
    setIsAdmin(userIsAdmin);

    // Redirect non-admins to my-balance page
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

    if (profilesError || !profiles) {
      console.error("Error fetching profiles:", profilesError);
      setLoading(false);
      return;
    }

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

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [supabase, router, organizationId]);

  const resetForm = () => {
    setFormDisplayName("");
    setFormDuesAmount("");
    setFormBillingFrequency("semester");
    setEditingClassId(null);
    setShowAddForm(false);
  };

  const handleAddPaymentClass = async () => {
    if (!formDisplayName.trim()) {
      alert("Display name is required");
      return;
    }

    setSubmitting(true);

    const className = formDisplayName.toLowerCase().replace(/\s+/g, "_");

    const { error } = await supabase
      .from("organization_payment_classes")
      .insert({
        organization_id: organizationId,
        class_name: className,
        display_name: formDisplayName,
        dues_amount: parseFloat(formDuesAmount) || 0,
        billing_frequency: formBillingFrequency,
        is_active: true,
      });

    if (error) {
      console.error("Error creating payment class:", error);
      alert(`Failed to create payment class: ${error.message}`);
      setSubmitting(false);
      return;
    }

    resetForm();
    setSubmitting(false);
    fetchData();
  };

  const handleUpdatePaymentClass = async () => {
    if (!formDisplayName.trim() || !editingClassId) {
      alert("Display name is required");
      return;
    }

    setSubmitting(true);

    const className = formDisplayName.toLowerCase().replace(/\s+/g, "_");

    const { error } = await supabase
      .from("organization_payment_classes")
      .update({
        class_name: className,
        display_name: formDisplayName,
        dues_amount: parseFloat(formDuesAmount) || 0,
        billing_frequency: formBillingFrequency,
      })
      .eq("id", editingClassId);

    if (error) {
      console.error("Error updating payment class:", error);
      alert(`Failed to update payment class: ${error.message}`);
      setSubmitting(false);
      return;
    }

    resetForm();
    setSubmitting(false);
    fetchData();
  };

  const startEditing = (paymentClass: PaymentClass) => {
    setEditingClassId(paymentClass.id);
    setFormDisplayName(paymentClass.display_name);
    setFormDuesAmount(paymentClass.dues_amount.toString());
    setFormBillingFrequency(paymentClass.billing_frequency);
    setShowAddForm(false);
  };

  const getDisplayName = (className: string) => {
    const paymentClass = paymentClasses.find(
      (pc) => pc.class_name === className
    );
    return paymentClass?.display_name || className;
  };

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
          Loading treasury...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "3rem 2rem",
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
              {isAdmin ? "Treasury Overview" : "My Balance"}
            </h1>

          </div>

          {/* Admin: Action Buttons */}
          {isAdmin && (
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button
                onClick={() => setShowManageClassesModal(true)}
                style={{
                  backgroundColor: "#448bfc",
                  color: "white",
                  fontWeight: 500,
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 12px rgba(68, 139, 252, 0.3)",
                }}
              >
                Manage Payment Classes
              </Button>
              <Button
                onClick={() =>
                  router.push(
                    `/organizations/${organizationId}/treasury/my-balance`
                  )
                }
                style={{
                  backgroundColor: "#448bfc",
                  color: "white",
                  fontWeight: 500,
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 12px rgba(68, 139, 252, 0.3)",
                }}
              >
                View My Balance
              </Button>
            </div>
          )}
        </div>

        {/* Members Balance Card */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 200px 150px",
              alignItems: "center",
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
            <span>Member</span>
            <span style={{ textAlign: "center" }}>Payment Class</span>
            <span style={{ textAlign: "right" }}>Balance</span>
          </div>

          {/* Members List */}
          {members.length === 0 ? (
            <p
              style={{
                padding: "2rem 1.5rem",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              No members found.
            </p>
          ) : (
            members.map((member, index) => (
              <div
                key={member.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 200px 150px",
                  alignItems: "center",
                  padding: "1.25rem 1.5rem",
                  borderBottom:
                    index < members.length - 1 ? "1px solid #f1f5f9" : "none",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
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
                    {(member.full_name || "U").charAt(0).toUpperCase()}
                  </div>
                  <p
                    style={{
                      fontWeight: 500,
                      color: "#1e293b",
                      fontSize: "0.95rem",
                    }}
                  >
                    {member.full_name}
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.375rem 0.875rem",
                      backgroundColor: "#eff6ff",
                      color: "#448bfc",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      borderRadius: "6px",
                    }}
                  >
                    {getDisplayName(member.payment_class)}
                  </span>
                </div>

                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "#1e293b",
                    textAlign: "right",
                  }}
                >
                  $0.00
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Manage Payment Classes Modal */}
      {showManageClassesModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => {
            setShowManageClassesModal(false);
            resetForm();
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "2rem",
              width: "90%",
              maxWidth: "700px",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#1e293b",
                }}
              >
                Manage Payment Classes
              </h2>
              <button
                onClick={() => {
                  setShowManageClassesModal(false);
                  resetForm();
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  color: "#64748b",
                  cursor: "pointer",
                  padding: "0.25rem",
                }}
              >
                ✕
              </button>
            </div>

            {/* Add New Class Button */}
            {!showAddForm && !editingClassId && (
              <Button
                onClick={() => setShowAddForm(true)}
                style={{
                  width: "100%",
                  backgroundColor: "#eff6ff",
                  color: "#448bfc",
                  fontWeight: 500,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "2px dashed #448bfc",
                  marginBottom: "1.5rem",
                }}
              >
                ➕ Add New Payment Class
              </Button>
            )}

            {/* Add Form */}
            {showAddForm && (
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: "1rem",
                  }}
                >
                  New Payment Class
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "#64748b",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formDisplayName}
                      onChange={(e) => setFormDisplayName(e.target.value)}
                      placeholder="e.g., Senior Member"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "#64748b",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Dues Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formDuesAmount}
                      onChange={(e) => setFormDuesAmount(e.target.value)}
                      placeholder="0.00"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "#64748b",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Billing Frequency
                    </label>
                    <select
                      value={formBillingFrequency}
                      onChange={(e) => setFormBillingFrequency(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    >
                      <option value="semester">Semester</option>
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annual</option>
                      <option value="one_time">One Time</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <Button
                      onClick={resetForm}
                      disabled={submitting}
                      style={{
                        flex: 1,
                        backgroundColor: "#e2e8f0",
                        color: "#64748b",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        border: "none",
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddPaymentClass}
                      disabled={submitting}
                      style={{
                        flex: 1,
                        backgroundColor: "#10b981",
                        color: "white",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        border: "none",
                      }}
                    >
                      {submitting ? "Creating..." : "Create"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Payment Classes List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {paymentClasses.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    padding: "2rem",
                  }}
                >
                  No payment classes yet. Add one to get started!
                </p>
              ) : (
                paymentClasses.map((pc) => (
                  <div
                    key={pc.id}
                    style={{
                      backgroundColor:
                        editingClassId === pc.id ? "#f8fafc" : "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: "1.25rem",
                    }}
                  >
                    {editingClassId === pc.id ? (
                      // Edit Mode
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "#64748b",
                              marginBottom: "0.5rem",
                            }}
                          >
                            Display Name
                          </label>
                          <input
                            type="text"
                            value={formDisplayName}
                            onChange={(e) => setFormDisplayName(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "0.75rem",
                              borderRadius: "6px",
                              border: "1px solid #e2e8f0",
                              fontSize: "1rem",
                            }}
                          />
                        </div>

                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "#64748b",
                              marginBottom: "0.5rem",
                            }}
                          >
                            Dues Amount
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formDuesAmount}
                            onChange={(e) => setFormDuesAmount(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "0.75rem",
                              borderRadius: "6px",
                              border: "1px solid #e2e8f0",
                              fontSize: "1rem",
                            }}
                          />
                        </div>

                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "#64748b",
                              marginBottom: "0.5rem",
                            }}
                          >
                            Billing Frequency
                          </label>
                          <select
                            value={formBillingFrequency}
                            onChange={(e) =>
                              setFormBillingFrequency(e.target.value)
                            }
                            style={{
                              width: "100%",
                              padding: "0.75rem",
                              borderRadius: "6px",
                              border: "1px solid #e2e8f0",
                              fontSize: "1rem",
                            }}
                          >
                            <option value="semester">Semester</option>
                            <option value="monthly">Monthly</option>
                            <option value="annual">Annual</option>
                            <option value="one_time">One Time</option>
                          </select>
                        </div>

                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          <Button
                            onClick={resetForm}
                            disabled={submitting}
                            style={{
                              flex: 1,
                              backgroundColor: "#e2e8f0",
                              color: "#64748b",
                              padding: "0.75rem",
                              borderRadius: "6px",
                              border: "none",
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleUpdatePaymentClass}
                            disabled={submitting}
                            style={{
                              flex: 1,
                              backgroundColor: "#448bfc",
                              color: "white",
                              padding: "0.75rem",
                              borderRadius: "6px",
                              border: "none",
                            }}
                          >
                            {submitting ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              fontSize: "1rem",
                              fontWeight: 600,
                              color: "#1e293b",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {pc.display_name}
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              gap: "1rem",
                              fontSize: "0.875rem",
                              color: "#64748b",
                            }}
                          >
                            <span>
                              <strong>${pc.dues_amount.toFixed(2)}</strong>
                            </span>
                            <span>•</span>
                            <span style={{ textTransform: "capitalize" }}>
                              {pc.billing_frequency.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => startEditing(pc)}
                          style={{
                            backgroundColor: "#eff6ff",
                            color: "#448bfc",
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            border: "1px solid #448bfc",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}