// src/components/ui/Card.tsx
import { ReactNode, CSSProperties } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  hover?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: ReactNode;
  style?: CSSProperties;
}

interface CardBodyProps {
  children: ReactNode;
  style?: CSSProperties;
}

interface CardFooterProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function Card({ children, style, hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
        }
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <div
      style={{
        padding: "1.5rem",
        borderBottom: "1px solid #e2e8f0",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, style }: CardBodyProps) {
  return (
    <div
      style={{
        padding: "1.5rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardFooter({ children, style }: CardFooterProps) {
  return (
    <div
      style={{
        padding: "1.5rem",
        borderTop: "1px solid #e2e8f0",
        backgroundColor: "#f8fafc",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <h3
      style={{
        fontSize: "1.25rem",
        fontWeight: 600,
        color: "#1e293b",
        margin: 0,
        ...style,
      }}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p
      style={{
        fontSize: "0.875rem",
        color: "#64748b",
        margin: "0.5rem 0 0 0",
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </p>
  );
}