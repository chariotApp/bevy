import { Crown, Zap } from "lucide-react";
import { styles } from "@/styles/upgrade.styles";

interface PricingCardsProps {
  isLoading: boolean;
  onUpgrade: () => void;
}

export function PricingCards({ isLoading, onUpgrade }: PricingCardsProps) {
  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>, isHovering: boolean) => {
    if (!isLoading) {
      if (isHovering) {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(68, 139, 252, 0.4)";
      } else {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(68, 139, 252, 0.3)";
      }
    }
  };

  return (
    <div style={styles.pricingGrid}>
      {/* Free Plan */}
      <div style={styles.freePlanCard}>
        <div style={styles.freePlanBadge}>
          <span style={styles.freePlanBadgeText}>FREE</span>
        </div>
        <h3 style={styles.planTitle}>Basic</h3>
        <div style={styles.priceContainer}>
          <span style={styles.priceAmount}>$0</span>
          <span style={styles.priceInterval}>/month</span>
        </div>
        <p style={styles.planDescription}>
          Perfect for small organizations getting started
        </p>
        <button disabled style={styles.currentPlanButton}>
          Current Plan
        </button>
      </div>

      {/* Premium Plan */}
      <div style={styles.premiumPlanCard}>
        <div style={styles.recommendedBadge}>
          <Crown size={16} />
          RECOMMENDED
        </div>
        <div style={styles.premiumBadge}>
          <Zap size={14} style={{ color: "#448bfc" }} />
          <span style={styles.premiumBadgeText}>PREMIUM</span>
        </div>
        <h3 style={styles.planTitle}>Premium</h3>
        <div style={styles.priceContainer}>
          <span style={styles.priceAmountPremium}>$49</span>
          <span style={styles.priceInterval}>/month</span>
        </div>
        <p style={styles.planDescription}>
          Everything you need to manage and grow your organization
        </p>
        <button
          onClick={onUpgrade}
          disabled={isLoading}
          style={isLoading ? styles.upgradeButtonLoading : styles.upgradeButton}
          onMouseEnter={(e) => handleButtonHover(e, true)}
          onMouseLeave={(e) => handleButtonHover(e, false)}
        >
          {isLoading ? "Processing..." : "Upgrade Now"}
        </button>
      </div>
    </div>
  );
}