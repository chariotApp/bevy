"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import Image from "next/image";
import logo from "../public/guild.png";
import profileIcon from "../public/profile.png";

type Org = {
  id: string;
  name: string;
};

export default function Navigationbar() {
  const router = useRouter();
  const supabase = createClient();

  const [userName, setUserName] = useState<string | null>(null);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const orgTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchProfileAndOrgs = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      setUserName(profile?.full_name || null);

      // Organizations
      const { data: orgData } = await supabase
        .from("organization_memberships")
        .select(`organization:organizations(id, name)`)
        .eq("user_id", user.id);

      setOrgs(orgData?.map((row: any) => row.organization).filter(Boolean) || []);
    };

    fetchProfileAndOrgs();
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleOrgMouseEnter = () => {
    if (orgTimeoutRef.current) {
      clearTimeout(orgTimeoutRef.current);
    }
    setOrgDropdownOpen(true);
  };

  const handleOrgMouseLeave = () => {
    orgTimeoutRef.current = setTimeout(() => {
      setOrgDropdownOpen(false);
    }, 300);
  };

  const handleProfileMouseEnter = () => {
    if (profileTimeoutRef.current) {
      clearTimeout(profileTimeoutRef.current);
    }
    setProfileDropdownOpen(true);
  };

  const handleProfileMouseLeave = () => {
    profileTimeoutRef.current = setTimeout(() => {
      setProfileDropdownOpen(false);
    }, 300);
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.6rem 3rem",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#fff",
        zIndex: 1000,
        position: "sticky",
        top: 0,
      }}
    >
      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Image src={logo} alt="Bevy logo" width={80} height={45} priority />
        <span style={{ fontWeight: 500, fontSize: "1.4rem", fontFamily: "revert" }}>
          
        </span>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative" }}>
        {/* Home */}
        <button
          onClick={() => router.push("/dashboard")}
          style={{ padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 500 }}
        >
          Home
        </button>

        {/* Organizations */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={handleOrgMouseEnter}
          onMouseLeave={handleOrgMouseLeave}
        >
          <button
            onClick={() => router.push("/organizations")}
            style={{
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontWeight: 500,
              background: "none",
              border: "none",
            }}
          >
            Organizations ▾
          </button>

          {orgDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "0.5rem",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                minWidth: "220px",
                overflow: "hidden",
                zIndex: 1001,
              }}
            >
              {orgs.length === 0 ? (
                <p style={{ padding: "0.75rem 1rem", color: "#6b7280" }}>
                  No organizations
                </p>
              ) : (
                orgs.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => router.push(`/organizations/${org.id}`)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {org.name}
                  </button>
                ))
              )}

              <div style={{ borderTop: "1px solid #e5e7eb" }} />

              <button
                onClick={() => router.push("/organizations/create")}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  fontWeight: 600,
                  color: "#6b46c1",
                  cursor: "pointer",
                }}
              >
                + Create Organization
              </button>
            </div>
          )}
        </div>

        {/* Profile */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={handleProfileMouseEnter}
          onMouseLeave={handleProfileMouseLeave}
        >
          {/* CLICKABLE ICON */}
          <div
            onClick={() => router.push("/profile")}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <Image src={profileIcon} alt="Profile" width={32} height={32} />
          </div>

          {profileDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "0.5rem",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                minWidth: "180px",
                overflow: "hidden",
                zIndex: 1001,
              }}
            >
              <p style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>
                {userName || "User"}
              </p>

              <div style={{ borderTop: "1px solid #e5e7eb" }} />

              <button
                onClick={() => router.push("/profile")}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Profile
              </button>

              <button
                onClick={signOut}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  color: "#6b46c1",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}