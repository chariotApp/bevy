"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Bot, Send, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function ArthurPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm Arthur, your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setCurrentUserId(user.id);
      setUserAuthenticated(true);
    };

    checkAuth();
  }, [supabase, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !currentUserId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call Arthur AI API
      const response = await fetch("/api/arthur/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          organizationId,
          userId: currentUserId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error calling Arthur API:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I apologize, but I encountered an error: ${error.message}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!userAuthenticated) {
    return (
      <div
        style={{
          height: "100vh",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "2rem 3rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            color: "#64748b",
            fontSize: "1.125rem",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "90vh",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          height: "calc(100vh - 100px)",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
            padding: "1.5rem 2rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <Bot size={28} color="white" strokeWidth={2} />
          </div>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "white",
                margin: 0,
                marginBottom: "0.25rem",
              }}
            >
              Arthur AI
            </h1>
            <p
              style={{
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255, 0.7)",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Sparkles size={14} />
              Your intelligent assistant
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "2rem",
            backgroundColor: "#f8f9fa",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
                flexDirection: message.role === "user" ? "row-reverse" : "row",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor:
                    message.role === "assistant"
                      ? "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)"
                      : "#f1f5f9",
                  background:
                    message.role === "assistant"
                      ? "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)"
                      : "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {message.role === "assistant" ? (
                  <Bot size={20} color="white" strokeWidth={2} />
                ) : (
                  <User size={20} color="#1a1a1a" strokeWidth={2} />
                )}
              </div>

              {/* Message Content */}
              <div
                style={{
                  maxWidth: "70%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  alignItems: message.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    borderRadius:
                      message.role === "assistant"
                        ? "18px 18px 18px 4px"
                        : "18px 18px 4px 18px",
                    backgroundColor:
                      message.role === "assistant" ? "white" : "#1a1a1a",
                    color: message.role === "assistant" ? "#1e293b" : "white",
                    boxShadow:
                      message.role === "assistant"
                        ? "0 2px 8px rgba(0, 0, 0, 0.08)"
                        : "0 2px 8px rgba(0, 0, 0, 0.3)",
                    lineHeight: "1.6",
                    fontSize: "0.95rem",
                  }}
                  className="markdown-content"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                    paddingLeft: message.role === "assistant" ? "0.5rem" : "0",
                    paddingRight: message.role === "user" ? "0.5rem" : "0",
                  }}
                >
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bot size={20} color="white" strokeWidth={2} />
              </div>
              <div
                style={{
                  padding: "1rem 1.25rem",
                  borderRadius: "18px 18px 18px 4px",
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <div
                  className="typing-dot"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#1a1a1a",
                    animation: "typing 1.4s infinite",
                  }}
                />
                <div
                  className="typing-dot"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#1a1a1a",
                    animation: "typing 1.4s infinite 0.2s",
                  }}
                />
                <div
                  className="typing-dot"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#1a1a1a",
                    animation: "typing 1.4s infinite 0.4s",
                  }}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: "1.5rem 2rem",
            backgroundColor: "white",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
              padding: "0.75rem 1rem",
              border: "2px solid transparent",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1a1a1a";
              e.currentTarget.style.backgroundColor = "white";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.backgroundColor = "#f8f9fa";
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Arthur anything..."
              disabled={isLoading}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "1rem",
                backgroundColor: "transparent",
                color: "#1e293b",
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background:
                  inputValue.trim() && !isLoading
                    ? "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)"
                    : "#e5e7eb",
                border: "none",
                cursor:
                  inputValue.trim() && !isLoading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                boxShadow:
                  inputValue.trim() && !isLoading
                    ? "0 4px 12px rgba(0, 0, 0, 0.4)"
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (inputValue.trim() && !isLoading) {
                  e.currentTarget.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Send
                size={20}
                color={inputValue.trim() && !isLoading ? "white" : "#94a3b8"}
                strokeWidth={2}
              />
            </button>
          </div>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              textAlign: "center",
              marginTop: "0.75rem",
              marginBottom: 0,
            }}
          >
            Arthur is an AI assistant. Responses may not always be accurate.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes typing {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        div:focus-within {
          outline: none;
        }

        .markdown-content h3 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 0.75rem 0;
          font-size: 0.9rem;
        }

        .markdown-content table th,
        .markdown-content table td {
          padding: 0.5rem 0.75rem;
          text-align: left;
          border: 1px solid #e5e7eb;
        }

        .markdown-content table th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #374151;
        }

        .markdown-content table td {
          background-color: #ffffff;
        }

        .markdown-content table tr:hover td {
          background-color: #f9fafb;
        }

        .markdown-content p {
          margin: 0.5rem 0;
        }

        .markdown-content p:first-child {
          margin-top: 0;
        }

        .markdown-content p:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}
