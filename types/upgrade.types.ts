/**
 * Feature comparison item
 */
export interface UpgradeFeature {
  name: string;
  free: boolean | string;
  premium: boolean | string;
}

/**
 * Plan types
 */
export type PlanType = "free" | "premium";

/**
 * Organization plan data
 */
export interface OrganizationPlan {
  id: string;
  plan: PlanType;
  updated_at: string;
}