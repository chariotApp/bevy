"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import AdminSidebar from "@/components/AdminSidebar";

export default function OrganizationSettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;

  const [orgName, setOrgName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // For editing
  const [newOrgName, setNewOrgName] = useState("");

  useEffect(() => {
    const fetchOrganization = async () => {
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

      if (!membership || membership.role !== "admin") {
        router.push(`/organizations/${organizationId}`);
        return;
      }

      setIsAdmin(true);

      // Get organization details
      const { data: org } = await supabase
        .from("organizations")
        .select("name, invite_code")
        .eq("id", organizationId)
        .single();

      if (org) {
        setOrgName(org.name);
        setNewOrgName(org.name);
        setInviteCode(org.invite_code);
      }

      setLoading(false);
    };

    fetchOrganization();
  }, [supabase, router, organizationId]);

  const handleSaveChanges = async () => {
    if (!newOrgName.trim()) {
      alert("Organization name cannot be empty");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("organizations")
      .update({ name: newOrgName })
      .eq("id", organizationId);

    if (error) {
      console.error("Error updating organization:", error);
      alert("Failed to update organization");
    } else {
      setOrgName(newOrgName);
      alert("Organization updated successfully!");
    }

    setSaving(false);
  };

  const handleRegenerateInviteCode = async () => {
    if (!confirm("Are you sure you want to regenerate the invite code? The old code will no longer work.")) {
      return;
    }

    setSaving(true);

    // Generate new random invite code
    const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const { error } = await supabase
      .from("organizations")
      .update({ invite_code: newCode })
      .eq("id", organizationId);

    if (error) {
      console.error("Error regenerating invite code:", error);
      alert("Failed to regenerate invite code");
    } else {
      setInviteCode(newCode);
      alert("Invite code regenerated successfully!");
    }

    setSaving(false);
  };

  const handleDeleteOrganization = async () => {
    const confirmText = prompt(
      `Are you sure you want to delete this organization? This action cannot be undone.\n\nType "${orgName}" to confirm:`
    );

    if (confirmText !== orgName) {
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("organizations")
      .delete()
      .eq("id", organizationId);

    if (error) {
      console.error("Error deleting organization:", error);
      alert("Failed to delete organization");
      setSaving(false);
    } else {
      alert("Organization deleted successfully");
      router.push("/organizations");
    }
  };

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading settings...</p>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <AdminSidebar organizationId={organizationId} />

      <div
        style={{
          padding: "2rem",
          maxWidth: "800px",
          margin: "0 auto",
          marginLeft: "72px",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          Organization Settings
        </h1>
        <p style={{ color: "#666", marginBottom: "2rem" }}>
          Manage your organization details and settings
        </p>

        {/* Organization Name */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
            Organization Name
          </h2>
          <input
            type="text"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "1rem",
              marginBottom: "1rem",
            }}
          />
          <Button onClick={handleSaveChanges} disabled={saving || newOrgName === orgName}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Invite Code */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
            Invite Code
          </h2>
          <p style={{ color: "#666", marginBottom: "1rem" }}>
            Share this code with others to let them join your organization
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <code
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#f3f4f6",
                borderRadius: "6px",
                fontSize: "1.1rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              {inviteCode}
            </code>
            <Button
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(inviteCode);
                alert("Invite code copied to clipboard!");
              }}
            >
              Copy
            </Button>
          </div>
          <Button variant="outline" onClick={handleRegenerateInviteCode} disabled={saving}>
            Regenerate Code
          </Button>
        </div>

        {/* Danger Zone */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "2px solid #ef4444",
            borderRadius: "8px",
            padding: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem", color: "#ef4444" }}>
            Danger Zone
          </h2>
          <p style={{ color: "#666", marginBottom: "1rem" }}>
            Once you delete an organization, there is no going back. All members will be removed and all data will be lost.
          </p>
          <Button
            variant="outline"
            onClick={handleDeleteOrganization}
            disabled={saving}
            style={{
              borderColor: "#ef4444",
              color: "#ef4444",
            }}
          >
            Delete Organization
          </Button>
        </div>
      </div>
    </>
  );
}