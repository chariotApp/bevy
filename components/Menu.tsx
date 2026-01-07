"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Menu button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontSize: "1.25rem",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      {/* Sidebar menu */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh", // full viewport height
            width: "250px",
            backgroundColor: "#fff",
            borderRight: "1px solid #ddd",
            boxShadow: "2px 0 12px rgba(0,0,0,0.1)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            paddingTop: "2rem",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            style={{
              marginLeft: "1rem",
              marginBottom: "1rem",
              fontSize: "1.25rem",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          {/* Menu items */}
          <button
            onClick={() => router.push("/organizations")}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              background: "none",
              textAlign: "left",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            Organizations
          </button>

          {/* Add more menu items here */}
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              background: "none",
              textAlign: "left",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            Dashboard
          </button>
        </div>
      )}

      {/* Optional: semi-transparent overlay to close sidebar */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 50,
          }}
        />
      )}
    </>
  );
}
