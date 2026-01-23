// src/components/ui/Modal.tsx
import { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
}

interface ModalHeaderProps {
  children: ReactNode;
  onClose?: () => void;
}

interface ModalBodyProps {
  children: ReactNode;
}

interface ModalFooterProps {
  children: ReactNode;
}

const sizeMap = {
  sm: "400px",
  md: "600px",
  lg: "800px",
  xl: "1000px",
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  closeOnOverlayClick = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
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
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "90%",
          maxWidth: sizeMap[size],
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          animation: "modalSlideIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <ModalHeader onClose={onClose}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#1e293b",
              }}
            >
              {title}
            </h2>
          </ModalHeader>
        )}
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ children, onClose }: ModalHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.5rem 2rem",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <div style={{ flex: 1 }}>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "#64748b",
            cursor: "pointer",
            padding: "0.25rem",
            lineHeight: 1,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#1e293b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#64748b";
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function ModalBody({ children }: ModalBodyProps) {
  return (
    <div
      style={{
        padding: "2rem",
      }}
    >
      {children}
    </div>
  );
}

export function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "0.75rem",
        padding: "1.5rem 2rem",
        borderTop: "1px solid #e2e8f0",
      }}
    >
      {children}
    </div>
  );
}

// Add animation keyframes via global style injection
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(styleSheet);
}