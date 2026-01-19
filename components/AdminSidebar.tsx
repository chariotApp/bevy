"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Users, Settings, DollarSign, Calendar, Megaphone, Car, HandCoins } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AdminSidebarProps = {
  organizationId: string;
  borderColor?: string;
};

export default function AdminSidebar({
  organizationId,
  borderColor = "#e5e7eb",
}: AdminSidebarProps) {
  const router = useRouter();
  const supabase = createClient();
  const [hovered, setHovered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: membership } = await supabase
        .from("organization_memberships")
        .select("role")
        .eq("organization_id", organizationId)
        .eq("user_id", user.id)
        .single();

      setIsAdmin(membership?.role === "admin");
    };

    checkAdminStatus();
  }, [supabase, organizationId]);

  const navbarHeight = 64;
  const collapsedWidth = 55;
  const expandedWidth = 180;

  const allMenuItems = [
    { 
      title: "Members", 
      icon: Users, 
      path: `/organizations/${organizationId}`, 
      adminOnly: false 
    },
    {
      title: "Finances",
      icon: DollarSign,
      path: isAdmin 
        ? `/organizations/${organizationId}/treasury` 
        : `/organizations/${organizationId}/treasury/my-balance`,
      adminOnly: false,
    },
    {
      title: "Calendar",
      icon: Calendar,
      path: `/organizations/${organizationId}/calendar`,
      adminOnly: false,
    },
    // --- NEW FUNDRAISING OPTION ---
    {
      title: "Fundraising",
      icon: HandCoins,
      path: `/organizations/${organizationId}/fundraising`,
      adminOnly: true,
    },
    // ------------------------------
    {
      title: "Announcements",
      icon: Megaphone,
      path: `/organizations/${organizationId}/announcements`,
      adminOnly: false,
    },
    {
      title: "Chariot",
      icon: Car,
      path: `/organizations/${organizationId}/chariot`,
      adminOnly: false,
    },
    {
      title: "Settings",
      icon: Settings,
      path: `/organizations/${organizationId}/settings`,
      adminOnly: true,
    },
  ];

  // Filter menu items based on admin status
  const menuItems = allMenuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: hovered ? `${expandedWidth}px` : `${collapsedWidth}px`,
        height: `calc(100vh - ${navbarHeight}px)`,
        position: "fixed",
        top: `${navbarHeight}px`,
        left: 0,
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: hovered ? "flex-start" : "center",
        paddingTop: "1.5rem",
        paddingLeft: hovered ? "1rem" : "0",
        gap: "1.5rem",
        zIndex: 40,
        borderRight: `1px solid ${borderColor}`,
        transition: "width 0.3s ease, padding 0.3s ease",
        overflow: "hidden",
      }}
    >
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.title}
            title={item.title}
            onClick={() => router.push(item.path)}
            style={{
              width: "100%",
              height: "44px",
              borderRadius: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: hovered ? "flex-start" : "center",
              gap: hovered ? "0.75rem" : "0",
              paddingLeft: hovered ? "0.75rem" : "0",
              color: "#000000",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Icon size={22} strokeWidth={2} />
            {hovered && (
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", fontSize: "0.95rem" }}>
                {item.title}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
}