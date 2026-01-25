"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Users, Settings, DollarSign, Calendar, Megaphone, Car, HandCoins, ClipboardPen, Crown, Lock, Bot } from "lucide-react";
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
  const [isPremium, setIsPremium] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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

      const { data: org } = await supabase
        .from("organizations")
        .select("premium")
        .eq("id", organizationId)
        .single();

      setIsPremium(org?.premium ?? true);
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
      adminOnly: false,
      premiumOnly: false
    },
    {
      title: "Finances",
      icon: DollarSign,
      path: isAdmin 
        ? `/organizations/${organizationId}/treasury` 
        : `/organizations/${organizationId}/treasury/my-balance`,
      adminOnly: false,
      premiumOnly: false
    },
    {
      title: "Fundraising",
      icon: HandCoins,
      path: `/organizations/${organizationId}/fundraising`,
      adminOnly: false,
      premiumOnly: true
    },
    {
      title: "Calendar",
      icon: Calendar,
      path: `/organizations/${organizationId}/calendar`,
      adminOnly: false,
      premiumOnly: true
    },
    {
      title: "Announcements",
      icon: Megaphone,
      path: `/organizations/${organizationId}/announcements`,
      adminOnly: false,
      premiumOnly: true  // This is now premium-only
    },
    {
      title: "Chariot",
      icon: Car,
      path: `/organizations/${organizationId}/chariot`,
      adminOnly: false,
      premiumOnly: true
    },
    {
      title: "Incident Report",
      icon: ClipboardPen,
      path: `/organizations/${organizationId}/incidents`,
      adminOnly: false,
      premiumOnly: true
    },
    {
      title: "Settings",
      icon: Settings,
      path: `/organizations/${organizationId}/settings`,
      adminOnly: true,
      premiumOnly: false
    },
  ];

  // Filter menu items:
  // - Members can't see premium features at all
  // - Admins can see premium features but they're locked if not premium
  const menuItems = allMenuItems.filter(item => {
    // Hide admin-only items from non-admins
    if (item.adminOnly && !isAdmin) return false;
    
    // Hide premium items from non-admin members
    if (item.premiumOnly && !isAdmin && !isPremium) return false;
    
    return true;
  });

  const handleItemClick = (item: typeof allMenuItems[0]) => {
    // If premium-only and not premium, show upgrade modal
    if (item.premiumOnly && !isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    
    router.push(item.path);
  };

  return (
    <>
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
          paddingTop: "0.75rem",
          paddingLeft: hovered ? "1rem" : "0",
          paddingBottom: "1rem",
          gap: "0.5rem",
          zIndex: 40,
          borderRight: `1px solid ${borderColor}`,
          transition: "width 0.3s ease, padding 0.3s ease",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isLocked = item.premiumOnly && !isPremium;
            
            return (
              <button
                key={item.title}
                title={isLocked ? `${item.title} (Premium Feature)` : item.title}
                onClick={() => handleItemClick(item)}
                style={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "12px",
                  background: "none",
                  border: "none",
                  cursor: isLocked ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: hovered ? "flex-start" : "center",
                  gap: hovered ? "0.75rem" : "0",
                  paddingLeft: hovered ? "0.75rem" : "0",
                  color: isLocked ? "#9ca3af" : "#000000",
                  transition: "background-color 0.2s ease",
                  opacity: isLocked ? 0.6 : 1,
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  } else {
                    e.currentTarget.style.backgroundColor = "#fef3c7";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Icon size={20} strokeWidth={2} />
                  {isLocked && !hovered && (
                    <Lock 
                      size={12} 
                      style={{ 
                        position: "absolute", 
                        bottom: -2, 
                        right: -2,
                        color: "#f59e0b"
                      }} 
                    />
                  )}
                </div>
                {hovered && (
                  <span style={{ 
                    fontWeight: 500, 
                    whiteSpace: "nowrap", 
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    {item.title}
                    {isLocked && <Lock size={14} color="#f59e0b" />}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        {isAdmin && (
          <button
            title={!isPremium ? "Arthur (Premium Feature)" : "Arthur"}
            onClick={() => {
              if (!isPremium) {
                setShowUpgradeModal(true);
              } else {
                router.push(`/organizations/${organizationId}/arthur`);
              }
            }}
            style={{
              width: "100%",
              height: "40px",
              borderRadius: "12px",
              background: "none",
              border: "none",
              cursor: !isPremium ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: hovered ? "flex-start" : "center",
              gap: hovered ? "0.75rem" : "0",
              paddingLeft: hovered ? "0.75rem" : "0",
              color: !isPremium ? "#9ca3af" : "#000000",
              transition: "background-color 0.2s ease",
              marginBottom: "0.5rem",
              opacity: !isPremium ? 0.6 : 1,
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (!isPremium) {
                e.currentTarget.style.backgroundColor = "#fef3c7";
              } else {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Bot size={20} strokeWidth={2} />
              {!isPremium && !hovered && (
                <Lock
                  size={12}
                  style={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    color: "#f59e0b"
                  }}
                />
              )}
            </div>
            {hovered && (
              <span style={{
                fontWeight: 500,
                whiteSpace: "nowrap",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                Arthur
                {!isPremium && <Lock size={14} color="#f59e0b" />}
              </span>
            )}
          </button>
        )}

        {!isPremium && (
          <button
            onClick={() => router.push(`/organizations/${organizationId}/upgrade`)}
            style={{
              width: hovered ? "calc(100% - 0.5rem)" : "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: hovered ? "0.5rem" : "0",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "0.875rem",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(99, 102, 241, 0.3)";
            }}
          >
            <Crown size={20} strokeWidth={2} />
            {hovered && <span style={{ whiteSpace: "nowrap" }}>Upgrade</span>}
          </button>
        )}
      </aside>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
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
            zIndex: 50,
          }}
          onClick={() => setShowUpgradeModal(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "2rem",
              maxWidth: "400px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <Crown size={32} color="#6366f1" />
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Premium Feature</h2>
            </div>
            <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
              This feature is only available for premium organizations. Upgrade now to unlock all premium features!
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  router.push(`/organizations/${organizationId}/upgrade`);
                }}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Upgrade Now
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}