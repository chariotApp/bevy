"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  full_name: string | null;
};

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [supabase, router]);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading profile...</p>;
  }

  if (!profile) {
    return <p style={{ padding: "2rem" }}>Profile not found.</p>;
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 600,
          marginBottom: "2rem",
        }}
      >
        Profile
      </h1>

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          padding: "1.5rem",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          backgroundColor: "#fff",
        }}
      >
        {/* Avatar (Initial-based) */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "#6b46c1",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: 700,
            userSelect: "none",
          }}
        >
          {profile.full_name?.charAt(0).toUpperCase() || "U"}
        </div>

        {/* Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <p style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            {profile.full_name || "Unnamed User"}
          </p>
          <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
            User ID: {profile.id}
          </p>
        </div>
      </div>
    </div>
  );
}
