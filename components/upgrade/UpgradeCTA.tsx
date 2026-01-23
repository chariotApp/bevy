import { Crown } from "lucide-react";
import { styles } from "@/styles/upgrade.styles";

interface UpgradeCTAProps {
  isLoading: boolean;
  onUpgrade: () => void;
}

export function UpgradeCTA({ isLoading, onUpgrade }: UpgradeCTAProps) {
  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>, isHovering: boolean) => {
    if (!isLoading) {
      if (isHovering) {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(68, 139, 252, 0.45)";
      } else {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(68, 139, 252, 0.35)";
      }
    }
  };

  return (
    <div style={styles.ctaSection}>
      <div style={styles.ctaIconContainer}>
        <div style={styles.ctaIcon}>
          <Crown size={32} style={{ color: "#ffffff" }} />
        </div>
      </div>
      <h3 style={styles.ctaTitle}>
        Ready to unlock your organization's full potential?
      </h3>
      <p style={styles.ctaDescription}>
        Join hundreds of organizations already using Premium to streamline operations and grow faster
      </p>
      <button
        onClick={onUpgrade}
        disabled={isLoading}
        style={isLoading ? styles.ctaButtonLoading : styles.ctaButton}
        onMouseEnter={(e) => handleButtonHover(e, true)}
        onMouseLeave={(e) => handleButtonHover(e, false)}
      >
        {isLoading ? "Processing..." : "Upgrade to Premium"}
      </button>
    </div>
  );
}