"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Sparkles } from "lucide-react";

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
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            width: "48px",
            height: "48px",
            border: "4px solid #e2e8f0",
            borderTop: "4px solid #448bfc",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <p style={{ color: "#64748b", marginTop: "1rem", fontSize: "1.125rem" }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative elements */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-5%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(68, 139, 252, 0.08) 0%, transparent 70%)",
        borderRadius: "50%"
      }}></div>
      <div style={{
        position: "absolute",
        bottom: "-10%",
        left: "-5%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(68, 139, 252, 0.06) 0%, transparent 70%)",
        borderRadius: "50%"
      }}></div>

      <div style={{
        position: "relative",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "4rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh"
      }}>
        <div style={{ maxWidth: "800px", width: "100%" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "white",
            borderRadius: "999px",
            padding: "0.5rem 1rem",
            marginBottom: "2rem",
            border: "1px solid #e2e8f0",
            color: "#448bfc"
          }}>
            <Sparkles style={{ width: "16px", height: "16px" }} />
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
              Welcome to Guild
            </span>
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontSize: "4rem",
            fontWeight: 800,
            color: "#1e293b",
            lineHeight: "1.1",
            marginBottom: "1.5rem"
          }}>
            Hello, {userName}! 👋
          </h1>

          {/* Accent Line */}
          <div style={{
            height: "6px",
            background: "linear-gradient(90deg, #448bfc 0%, #93c5fd 100%)",
            borderRadius: "999px",
            width: "120px",
            marginBottom: "2rem"
          }}></div>

          {/* Description */}
          <p style={{
            fontSize: "1.25rem",
            color: "#64748b",
            lineHeight: "1.8",
            marginBottom: "3rem"
          }}>
            Welcome to <span style={{ fontWeight: 700, color: "#1e293b" }}>Guild</span>, your all-in-one platform for managing clubs and organizations. Track payments, manage members, and keep your club running smoothly—all in one place.
          </p>

          {/* Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            marginBottom: "3rem"
          }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              border: "1px solid #e2e8f0",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "#448bfc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#448bfc" }}>
                $10M+
              </div>
              <div style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>
                Processed
              </div>
            </div>
            
            <div style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              border: "1px solid #e2e8f0",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "#448bfc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#448bfc" }}>
                500+
              </div>
              <div style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>
                Organizations
              </div>
            </div>
            
            <div style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              border: "1px solid #e2e8f0",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "#448bfc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#448bfc" }}>
                50K+
              </div>
              <div style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>
                Members
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div>
            <a
              href="/organizations"
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#448bfc",
                color: "white",
                padding: "1rem 2rem",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "1.125rem",
                textDecoration: "none",
                transition: "all 0.3s",
                border: "none",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3378e8";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#448bfc";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Go to Orgs. →
            </a>
          </div>

          {/* Feature Highlights */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginTop: "4rem"
          }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#eff6ff",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <span style={{ fontSize: "1.5rem" }}>💳</span>
              </div>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b", marginBottom: "0.25rem" }}>
                  Payment Tracking
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: "1.5" }}>
                  Monitor dues and payments effortlessly
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#eff6ff",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <span style={{ fontSize: "1.5rem" }}>👥</span>
              </div>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b", marginBottom: "0.25rem" }}>
                  Member Management
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: "1.5" }}>
                  Organize and manage your team easily
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#eff6ff",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <span style={{ fontSize: "1.5rem" }}>📊</span>
              </div>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b", marginBottom: "0.25rem" }}>
                  Analytics & Insights
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: "1.5" }}>
                  Track growth with powerful analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}