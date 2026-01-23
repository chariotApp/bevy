import { Sparkles } from "lucide-react";
import { styles } from "@/styles/upgrade.styles";

export function UpgradeHeader() {
  return (
    <div style={styles.headerContainer}>
      <div style={styles.headerContent}>
        <div style={styles.headerIcon}>
          <Sparkles size={28} style={{ color: "#ffffff" }} />
        </div>
        <h1 style={styles.headerTitle}>
          Upgrade to Premium
        </h1>
      </div>
    </div>
  );
}