"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminSidebarProps = {
  organizationId: string;
  iconColor?: string; // optional prop to customize icon color
  borderColor?: string; // optional prop for the right border
};

export default function AdminSidebar({
  organizationId,
  iconColor = "#00BFFF",
  borderColor = "#e5e7eb",
}: AdminSidebarProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const navbarHeight = 64; // adjust if your navbar height changes
  const collapsedWidth = 55;
  const expandedWidth = 180;

  const menuItems = [
    { title: "Members", icon: "👥", path: `/organizations/${organizationId}` },
    {
      title: "Settings",
      icon: "⚙️",
      path: `/organizations/${organizationId}/settings`,
    },
    {
      title: "Treasury",
      icon: "💳",
      path: `/organizations/${organizationId}/treasury`,
    },
  ];

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
      {menuItems.map((item) => (
        <button
          key={item.title}
          title={item.title}
          onClick={() => router.push(item.path)}
          style={{
            ...iconButtonStyle,
            color: iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: hovered ? "flex-start" : "center",
            gap: hovered ? "0.75rem" : "0",
            width: "100%",
            paddingLeft: hovered ? "0.75rem" : "0",
          }}
        >
          <span style={{ fontSize: "1.4rem" }}>{item.icon}</span>
          {hovered && (
            <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
              {item.title}
            </span>
          )}
        </button>
      ))}
    </aside>
  );
}

const iconButtonStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  borderRadius: "12px",
  background: "none",
  border: "none",
  fontSize: "1.4rem",
  cursor: "pointer",
};