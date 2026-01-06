"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import logo from "../Public/Logo.png"

export default function Navigationbar() {
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.75rem 1.5rem",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* LEFT SECTION: menu + logo + app name */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Menu button */}
        <button
          aria-label="Open menu"
          style={{
            fontSize: "1.25rem",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        {/* Logo placeholder */}
        <Image
          src={logo}
          alt="Bevy logo"
          width={70}
          height={70}
          priority
        />

        {/* App name */}
        <span style={{ fontWeight: 700, fontSize: "1.4rem", fontFamily: "-apple-system" }}>
          Bevy
        </span>
      </div>

      {/* RIGHT SECTION */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={() => router.push("/dashboard")}>Dashboard</button>
        <button onClick={signOut}>Logout</button>
      </div>
    </nav>
  );
}
