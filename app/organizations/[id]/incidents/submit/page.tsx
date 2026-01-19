"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SubmitIncidentPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description || !incidentDate) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("incident_reports").insert({
      organization_id: organizationId,
      reporter_id: user.id,
      title,
      description,
      incident_date: incidentDate,
      location: location || null,
      severity,
      status: "pending",
    });

    if (error) {
      console.error("Error submitting incident:", error);
      alert("Failed to submit incident report");
      setSubmitting(false);
      return;
    }

    alert("Incident report submitted successfully!");
    router.push(`/organizations/${organizationId}/incidents`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "3rem 2rem",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            marginBottom: "1.5rem",
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            color: "#64748b",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.875rem",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f8fafc";
            e.currentTarget.style.borderColor = "#cbd5e1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Header */}
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: "0.5rem",
          }}
        >
          Submit Incident Report
        </h1>
        <p style={{ color: "#64748b", fontSize: "1rem", marginBottom: "2rem" }}>
          Report any incidents, safety concerns, or issues within your organization
        </p>

        {/* Form */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Title */}
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
              Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of the incident"
              style={{
                width: "100%",
                padding: "0.75rem",
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
          </div>

          {/* Description */}
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
              Description <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what happened..."
              rows={6}
              style={{
                width: "100%",
                padding: "0.75rem",
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
          </div>

          {/* Incident Date */}
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
              Incident Date & Time <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="datetime-local"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
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
          </div>

          {/* Location */}
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
              Location (Optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where did this incident occur?"
              style={{
                width: "100%",
                padding: "0.75rem",
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
          </div>

          {/* Severity */}
          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: "0.5rem",
              }}
            >
              Severity <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1rem",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                outline: "none",
                cursor: "pointer",
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
            >
              <option value="low">Low - Minor issue</option>
              <option value="medium">Medium - Moderate concern</option>
              <option value="high">High - Serious issue</option>
              <option value="critical">Critical - Immediate attention required</option>
            </select>
          </div>

          {/* Submit Button */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button
              onClick={() => router.back()}
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
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#448bfc",
                color: "white",
                cursor: submitting ? "not-allowed" : "pointer",
                fontWeight: 600,
                transition: "all 0.2s",
                boxShadow: "0 2px 8px rgba(68, 139, 252, 0.3)",
                opacity: submitting ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.currentTarget.style.backgroundColor = "#3378e8";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(68, 139, 252, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#448bfc";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(68, 139, 252, 0.3)";
              }}
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}