// src/components/ui/Table.tsx
import { ReactNode, CSSProperties } from "react";

interface TableProps {
  children: ReactNode;
  style?: CSSProperties;
}

interface TableHeaderProps {
  children: ReactNode;
  columns?: string;
  style?: CSSProperties;
}

interface TableRowProps {
  children: ReactNode;
  columns?: string;
  onClick?: () => void;
  hover?: boolean;
  style?: CSSProperties;
}

interface TableCellProps {
  children: ReactNode;
  align?: "left" | "center" | "right";
  style?: CSSProperties;
}

export function Table({ children, style }: TableProps) {
  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function TableHeader({ children, columns, style }: TableHeaderProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columns || "1fr",
        alignItems: "center",
        padding: "1rem 1.5rem",
        backgroundColor: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        fontWeight: 600,
        fontSize: "0.875rem",
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function TableRow({
  children,
  columns,
  onClick,
  hover = true,
  style,
}: TableRowProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "grid",
        gridTemplateColumns: columns || "1fr",
        alignItems: "center",
        padding: "1.25rem 1.5rem",
        transition: "background-color 0.2s",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.backgroundColor = "#f8fafc";
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {children}
    </div>
  );
}

export function TableCell({ children, align = "left", style }: TableCellProps) {
  return (
    <div
      style={{
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function TableEmpty({ message = "No data available" }: { message?: string }) {
  return (
    <div
      style={{
        padding: "2rem 1.5rem",
        textAlign: "center",
        color: "#64748b",
      }}
    >
      {message}
    </div>
  );
}