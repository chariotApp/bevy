"use client";

import { Check, X, Crown, Sparkles, Zap } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function UpgradePage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.organizationId as string;
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    // Add your upgrade logic here (e.g., redirect to payment, API call, etc.)
    // For now, just simulate a delay
    setTimeout(() => {
      router.push(`/organizations/${organizationId}/settings`);
    }, 1500);
  };

  const features = [
    {
      name: "Maximum members",
      free: "50 members",
      premium: "Unlimited members",
    },
    {
      name: "Financial management tools",
      free: "Basic",
      premium: "Advanced",
    },
    {
      name: "Attendance Management",
      free: false,
      premium: true,
    },
    {
      name: "Advanced member management",
      free: false,
      premium: true,
    },
    {
      name: "Ride Share Mobile App",
      free: false,
      premium: true,
    },
    {
      name: "Calendar and event scheduling",
      free: false,
      premium: true,
    },
    {
      name: "Announcements",
      free: false,
      premium: true,
    },
    {
      name: "Fundraising tools",
      free: false,
      premium: true,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "0.75rem",
            marginBottom: "1rem"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #448bfc 0%, #2563eb 100%)",
              borderRadius: "12px",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Sparkles size={28} style={{ color: "#ffffff" }} />
            </div>
            <h1 style={{ 
              fontSize: "2.75rem", 
              fontWeight: "800", 
              margin: 0,
              color: "#0f172a"
            }}>
              Upgrade to Premium
            </h1>
          </div>
        </div>

        {/* Pricing Cards */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: "2rem",
          marginBottom: "4rem",
          maxWidth: "900px",
          margin: "0 auto 4rem"
        }}>
          {/* Free Plan */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "2.5rem 2rem",
            border: "2px solid #e2e8f0",
            position: "relative",
            transition: "all 0.3s ease"
          }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#f1f5f9",
              borderRadius: "8px",
              marginBottom: "1rem"
            }}>
              <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "#475569" }}>
                FREE
              </span>
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem", color: "#0f172a" }}>
              Basic
            </h3>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "3.5rem", fontWeight: "800", color: "#0f172a" }}>$0</span>
              <span style={{ fontSize: "1.125rem", color: "#64748b" }}>/month</span>
            </div>
            <p style={{ color: "#64748b", marginBottom: "2rem", lineHeight: "1.5" }}>
              Perfect for small organizations getting started
            </p>
            <button
              disabled
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                color: "#94a3b8",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "not-allowed"
              }}
            >
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "2.5rem 2rem",
            border: "3px solid #448bfc",
            position: "relative",
            boxShadow: "0 20px 60px rgba(68, 139, 252, 0.25)",
            transform: "scale(1.05)"
          }}>
            <div style={{
              position: "absolute",
              top: "-14px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(135deg, #448bfc 0%, #2563eb 100%)",
              color: "#ffffff",
              padding: "0.5rem 1.5rem",
              borderRadius: "20px",
              fontSize: "0.875rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              boxShadow: "0 4px 12px rgba(68, 139, 252, 0.4)"
            }}>
              <Crown size={16} />
              RECOMMENDED
            </div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              borderRadius: "8px",
              marginBottom: "1rem",
              marginTop: "0.5rem"
            }}>
              <Zap size={14} style={{ color: "#448bfc" }} />
              <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "#448bfc" }}>
                PREMIUM
              </span>
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem", color: "#0f172a" }}>
              Premium
            </h3>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "3.5rem", fontWeight: "800", color: "#448bfc" }}>$49</span>
              <span style={{ fontSize: "1.125rem", color: "#64748b" }}>/month</span>
            </div>
            <p style={{ color: "#64748b", marginBottom: "2rem", lineHeight: "1.5" }}>
              Everything you need to manage and grow your organization
            </p>
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #448bfc 0%, #2563eb 100%)",
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(68, 139, 252, 0.3)"
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(68, 139, 252, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(68, 139, 252, 0.3)";
              }}
            >
              {isLoading ? "Processing..." : "Upgrade Now"}
            </button>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "2.5rem 2rem",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.08)",
          border: "1px solid #f1f5f9"
        }}>
          <h2 style={{ 
            fontSize: "2rem", 
            fontWeight: "800", 
            marginBottom: "0.5rem",
            textAlign: "center",
            color: "#0f172a"
          }}>
            Feature Comparison
          </h2>
          <p style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: "2.5rem",
            fontSize: "1.05rem"
          }}>
            See exactly what you get with Premium
          </p>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px" }}>
              <thead>
                <tr>
                  <th style={{ 
                    textAlign: "left", 
                    padding: "1.25rem 1rem",
                    fontSize: "0.95rem",
                    fontWeight: "700",
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Feature
                  </th>
                  <th style={{ 
                    textAlign: "center", 
                    padding: "1.25rem 1rem",
                    fontSize: "0.95rem",
                    fontWeight: "700",
                    color: "#475569",
                    width: "180px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Free
                  </th>
                  <th style={{ 
                    textAlign: "center", 
                    padding: "1.25rem 1rem",
                    fontSize: "0.95rem",
                    fontWeight: "700",
                    color: "#448bfc",
                    width: "180px",
                    backgroundColor: "#f0f9ff",
                    borderRadius: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr 
                    key={index}
                    style={{ 
                      transition: "all 0.2s ease"
                    }}
                  >
                    <td style={{ 
                      padding: "1.125rem 1rem",
                      fontSize: "0.975rem",
                      color: "#334155",
                      fontWeight: "500",
                      borderTop: index === 0 ? "none" : "1px solid #f1f5f9",
                      borderBottom: "1px solid #f1f5f9"
                    }}>
                      {feature.name}
                    </td>
                    <td style={{ 
                      textAlign: "center", 
                      padding: "1.125rem 1rem",
                      borderTop: index === 0 ? "none" : "1px solid #f1f5f9",
                      borderBottom: "1px solid #f1f5f9"
                    }}>
                      {typeof feature.free === "boolean" ? (
                        feature.free ? (
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{
                              backgroundColor: "#dcfce7",
                              borderRadius: "50%",
                              padding: "0.375rem",
                              display: "inline-flex"
                            }}>
                              <Check size={18} style={{ color: "#16a34a", strokeWidth: 3 }} />
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{
                              backgroundColor: "#fee2e2",
                              borderRadius: "50%",
                              padding: "0.375rem",
                              display: "inline-flex"
                            }}>
                              <X size={18} style={{ color: "#dc2626", strokeWidth: 3 }} />
                            </div>
                          </div>
                        )
                      ) : (
                        <span style={{ 
                          fontSize: "0.9rem", 
                          color: "#64748b",
                          fontWeight: "500"
                        }}>
                          {feature.free}
                        </span>
                      )}
                    </td>
                    <td style={{ 
                      textAlign: "center", 
                      padding: "1.125rem 1rem",
                      backgroundColor: "#fafcff",
                      borderTop: index === 0 ? "none" : "1px solid #e0f2fe",
                      borderBottom: "1px solid #e0f2fe"
                    }}>
                      {typeof feature.premium === "boolean" ? (
                        feature.premium ? (
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{
                              background: "linear-gradient(135deg, #448bfc 0%, #2563eb 100%)",
                              borderRadius: "50%",
                              padding: "0.375rem",
                              display: "inline-flex",
                              boxShadow: "0 2px 8px rgba(68, 139, 252, 0.25)"
                            }}>
                              <Check size={18} style={{ color: "#ffffff", strokeWidth: 3 }} />
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{
                              backgroundColor: "#fee2e2",
                              borderRadius: "50%",
                              padding: "0.375rem",
                              display: "inline-flex"
                            }}>
                              <X size={18} style={{ color: "#dc2626", strokeWidth: 3 }} />
                            </div>
                          </div>
                        )
                      ) : (
                        <span style={{ 
                          fontSize: "0.9rem", 
                          color: "#448bfc", 
                          fontWeight: "700"
                        }}>
                          {feature.premium}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          marginTop: "3rem",
          textAlign: "center",
          padding: "3.5rem 2rem",
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          borderRadius: "20px",
          border: "2px solid #bfdbfe"
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #448bfc 0%, #2563eb 100%)",
              borderRadius: "50%",
              padding: "1rem",
              boxShadow: "0 8px 20px rgba(68, 139, 252, 0.3)"
            }}>
              <Crown size={32} style={{ color: "#ffffff" }} />
            </div>
          </div>
          <h3 style={{ 
            fontSize: "2rem", 
            fontWeight: "800", 
            marginBottom: "0.75rem",
            color: "#0f172a"
          }}>
            Ready to unlock your organization's full potential?
          </h3>
          <p style={{ 
            color: "#475569", 
            marginBottom: "2rem", 
            fontSize: "1.125rem",
            maxWidth: "600px",
            margin: "0 auto 2rem",
            lineHeight: "1.6"
          }}>
            Join hundreds of organizations already using Premium to streamline operations and grow faster
          </p>
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            style={{
              padding: "1.125rem 3rem",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #448bfc 0%, #2563eb 100%)",
              color: "#ffffff",
              fontSize: "1.125rem",
              fontWeight: "700",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 6px 20px rgba(68, 139, 252, 0.35)"
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(68, 139, 252, 0.45)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(68, 139, 252, 0.35)";
            }}
          >
            {isLoading ? "Processing..." : "Upgrade to Premium"}
          </button>
        </div>
      </div>
    </div>
  );
}