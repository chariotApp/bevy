"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function CreateOrganizationPage() {
  const supabase = createClient();
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Organization name is required");
      return;
    }

    setLoading(true);

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // 1️⃣ Create organization
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({ name })
      .select()
      .single();

    if (orgError || !org) {
      console.error(orgError);
      alert("Failed to create organization");
      setLoading(false);
      return;
    }

    // 2️⃣ Add creator as admin
    const { error: memberError } = await supabase
      .from("organization_memberships")
      .insert({
        organization_id: org.id,
        user_id: user.id,
        role: "admin",
      });

    if (memberError) {
      console.error(memberError);
      alert("Organization created, but failed to assign role");
      setLoading(false);
      return;
    }

    // Success
    router.push("/organizations");
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        paddingTop: "6vh",
        backgroundColor: "#f7f7f7",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Create Organization
        </h1>

        <input
          type="text"
          placeholder="Organization name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            marginBottom: "1.5rem",
          }}
        />

        <Button
          onClick={handleCreate}
          disabled={loading}
          size="lg"
          style={{ width: "100%" }}
        >
          {loading ? "Creating..." : "Create Organization"}
        </Button>
      </div>
    </div>
  );
}
