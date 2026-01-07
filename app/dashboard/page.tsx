"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function WelcomePage() {
  const supabase = createClient();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (error) console.error("Error fetching profile:", error);
      else setUserName(profile?.full_name || "User");

      setLoading(false);
    };

    fetchUserName();
  }, [supabase]);

  if (loading) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        minHeight: "85vh",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        gap: "2rem",
        backgroundColor: "#f7f7f7",
      }}
    >
      {/* Left: Waving Owl Image */}
      <div style={{ flex: 1, minWidth: "300px", display: "flex", justifyContent: "center" }}>
        <Image
          src="/WavingOwl.png" // reference image from public folder
          alt="Waving Owl"
          width={400}
          height={400}
          style={{ borderRadius: "12px", objectFit: "contain" }}
        />
      </div>

      {/* Right: Welcome Text */}
      <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#111827" }}>
          Hello, {userName} 👋
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#4b5563", lineHeight: 1.6 }}>
          Welcome to <strong>Bevy</strong>, your all-in-one platform for managing clubs and organizations.
          Track payments, manage members, and keep your club running smoothly—all in one place.
        </p>
      </div>
    </div>
  );
}
