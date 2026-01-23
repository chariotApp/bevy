import { Check, X } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/Table";
import { styles } from "@/styles/upgrade.styles";
import { UPGRADE_FEATURES } from "@/lib/utils/upgrade";
import { UpgradeFeature } from "@/types/upgrade.types";

export function FeatureComparisonTable() {
  const renderFeatureValue = (value: boolean | string, isPremium: boolean) => {
    if (typeof value === "boolean") {
      return (
        <TableCell align="center">
          <div style={styles.checkIconContainer}>
            {value ? (
              <div style={isPremium ? styles.premiumCheckIconBadge : styles.checkIconBadge}>
                <Check 
                  size={18} 
                  style={{ 
                    color: isPremium ? "#ffffff" : "#16a34a", 
                    strokeWidth: 3 
                  }} 
                />
              </div>
            ) : (
              <div style={styles.xIconBadge}>
                <X size={18} style={{ color: "#dc2626", strokeWidth: 3 }} />
              </div>
            )}
          </div>
        </TableCell>
      );
    }

    return (
      <TableCell align="center">
        <span style={isPremium ? styles.featureTextPremium : styles.featureText}>
          {value}
        </span>
      </TableCell>
    );
  };

  return (
    <div style={styles.featureTableContainer}>
      <h2 style={styles.featureTableTitle}>Feature Comparison</h2>
      <p style={styles.featureTableSubtitle}>
        See exactly what you get with Premium
      </p>
      
      <Table>
        <TableHeader columns="2fr 1fr 1fr">
          <TableCell>Feature</TableCell>
          <TableCell align="center">Free</TableCell>
          <TableCell 
            align="center" 
            style={{ 
              color: "#448bfc",
              fontWeight: "700"
            }}
          >
            Premium
          </TableCell>
        </TableHeader>
        <TableBody>
          {UPGRADE_FEATURES.map((feature: UpgradeFeature, index: number) => (
            <TableRow 
              key={index} 
              columns="2fr 1fr 1fr"
              hover={false}
              style={{
                borderBottom: index < UPGRADE_FEATURES.length - 1 ? "1px solid #f1f5f9" : "none"
              }}
            >
              <TableCell>
                <span style={{ 
                  fontSize: "0.975rem", 
                  color: "#334155",
                  fontWeight: "500"
                }}>
                  {feature.name}
                </span>
              </TableCell>
              {renderFeatureValue(feature.free, false)}
              {renderFeatureValue(feature.premium, true)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}