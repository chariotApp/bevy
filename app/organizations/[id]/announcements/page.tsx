"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone, X } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_by: string;
  author_name: string;
};

export default function AnnouncementsPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Check if user is admin
      const { data: membership } = await supabase
        .from("organization_memberships")
        .select("role")
        .eq("organization_id", organizationId)
        .eq("user_id", user.id)
        .single();

      setIsAdmin(membership?.role === "admin");

      // Fetch announcements
      const { data: announcementsData, error: announcementsError } = await supabase
        .from("announcements")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (announcementsError) {
        console.error("Error fetching announcements:", announcementsError);
      } else if (announcementsData) {
        // Fetch author names
        const authorIds = [...new Set(announcementsData.map((a) => a.created_by))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", authorIds);

        const mappedAnnouncements = announcementsData.map((announcement) => {
          const author = profiles?.find((p) => p.id === announcement.created_by);
          return {
            ...announcement,
            author_name: author?.full_name || "Unknown",
          };
        });

        setAnnouncements(mappedAnnouncements);
      }

      setLoading(false);
    };

    fetchData();
  }, [supabase, router, organizationId]);

  const handleCreateAnnouncement = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("announcements")
      .insert({
        organization_id: organizationId,
        title: newTitle.trim(),
        content: newContent.trim(),
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating announcement:", error);
      alert("Failed to create announcement");
      setSubmitting(false);
      return;
    }

    // Fetch author name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const newAnnouncement = {
      ...data,
      author_name: profile?.full_name || "Unknown",
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setNewTitle("");
    setNewContent("");
    setShowCreateModal(false);
    setSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return hours === 0 ? "Just now" : `${hours}h ago`;
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem 3rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            color: "#64748b",
            fontSize: "1.125rem",
          }}
        >
          Loading announcements...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.2s ease-out",
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
              animation: "slideUp 0.3s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.5rem",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Create Announcement
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  padding: "0.25rem",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.5rem" }}>
              {/* Title Input */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: "0.5rem",
                  }}
                >
                  Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter announcement title..."
                  maxLength={100}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    fontSize: "1rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#448bfc";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(68, 139, 252, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    marginTop: "0.25rem",
                    textAlign: "right",
                  }}
                >
                  {newTitle.length}/100
                </p>
              </div>

              {/* Content Textarea */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: "0.5rem",
                  }}
                >
                  Content
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="What would you like to announce?"
                  maxLength={2000}
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    fontSize: "1rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#448bfc";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(68, 139, 252, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    marginTop: "0.25rem",
                    textAlign: "right",
                  }}
                >
                  {newContent.length}/2000
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
                padding: "1.5rem",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={submitting}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "white",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontWeight: 500,
                  color: "#64748b",
                  transition: "all 0.2s",
                  opacity: submitting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                    e.currentTarget.style.borderColor = "#cbd5e1";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAnnouncement}
                disabled={submitting || !newTitle.trim() || !newContent.trim()}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#448bfc",
                  color: "white",
                  cursor:
                    submitting || !newTitle.trim() || !newContent.trim()
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  boxShadow: "0 2px 8px rgba(68, 139, 252, 0.3)",
                  opacity:
                    submitting || !newTitle.trim() || !newContent.trim() ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!submitting && newTitle.trim() && newContent.trim()) {
                    e.currentTarget.style.backgroundColor = "#3378e8";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(68, 139, 252, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#448bfc";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(68, 139, 252, 0.3)";
                }}
              >
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          minHeight: "100vh",
          background: "#ffffff",
          padding: "2rem 2rem",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "2.5rem",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: "0.5rem",
                }}
              >
                Announcements
              </h1>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "1rem",
                }}
              >
                Stay updated with the latest news and updates
              </p>
            </div>

            {/* Add Announcement Button - Only for Admins */}
            {isAdmin && (
              <Button
                onClick={() => setShowCreateModal(true)}
                style={{
                  backgroundColor: "#448bfc",
                  color: "white",
                  fontWeight: 500,
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 12px rgba(68, 139, 252, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
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
                <Plus size={18} /> New Announcement
              </Button>
            )}
          </div>

          {/* Announcements List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {announcements.length === 0 ? (
              <div
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "4rem 2rem",
                  textAlign: "center",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  <Megaphone size={32} color="#94a3b8" />
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: "0.5rem",
                  }}
                >
                  No announcements yet
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                  {isAdmin
                    ? "Create your first announcement to keep members informed."
                    : "Check back later for updates from your organization."}
                </p>
              </div>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1.75rem",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "1rem",
                      gap: "1rem",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        color: "#1e293b",
                        margin: 0,
                      }}
                    >
                      {announcement.title}
                    </h2>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "#64748b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(announcement.created_at)}
                    </span>
                  </div>

                  {/* Content */}
                  <p
                    style={{
                      color: "#475569",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                      marginBottom: "1rem",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {announcement.content}
                  </p>

                  {/* Footer */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid #f1f5f9",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: "#eff6ff",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#448bfc",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {announcement.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "#1e293b",
                          margin: 0,
                        }}
                      >
                        {announcement.author_name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          margin: 0,
                        }}
                      >
                        Posted {formatDate(announcement.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}