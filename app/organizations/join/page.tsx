"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function JoinOrganizationPage() {
  const supabase = createClient();
  const router = useRouter();

  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!inviteCode) {
      alert("Please enter an invite code.");
      return;
    }

    setLoading(true);

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("You must be logged in to join an organization.");
      setLoading(false);
      return;
    }

    // Look up organization by invite code
    const { data: orgData, error: orgError } = await supabase
      .from("organizations")
      .select("id, name")
      .eq("invite_code", inviteCode)
      .single();

    if (orgError || !orgData) {
      alert("Invalid invite code.");
      setLoading(false);
      return;
    }

    // Insert membership
    const { error: membershipError } = await supabase
      .from("organization_memberships")
      .insert({
        organization_id: orgData.id,
        user_id: user.id,
        role: "member",
      });

    if (membershipError) {
      alert(`Failed to join organization: ${membershipError.message}`);
      setLoading(false);
      return;
    }

    alert(`Successfully joined "${orgData.name}"!`);
    router.push("/organizations");
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "10vh",
        backgroundColor: "#f7f7f7",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            fontWeight: 500,
          }}
        >
          Join Organization
        </h1>

        <input
          type="text"
          placeholder="Enter Invite Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />

        <Button
          onClick={handleJoin}
          size="lg"
          style={{ backgroundColor: "#6b46c1", color: "#fff" }}
          disabled={loading}
        >
          {loading ? "Joining..." : "Join Organization"}
        </Button>
      </div>
    </div>
  );
}
