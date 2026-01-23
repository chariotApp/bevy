import { UpgradeFeature } from "@/types/upgrade.types";

/**
 * List of features compared between free and premium plans
 */
export const UPGRADE_FEATURES: UpgradeFeature[] = [
  {
    name: "Maximum members",
    free: "50 members",
    premium: "Unlimited members",
  },
  {
    name: "Financial management tools",
    free: "Basic",
    premium: "Advanced",
  },
  {
    name: "Attendance Management",
    free: false,
    premium: true,
  },
  {
    name: "Advanced member management",
    free: false,
    premium: true,
  },
  {
    name: "Ride Share Mobile App",
    free: false,
    premium: true,
  },
  {
    name: "Calendar and event scheduling",
    free: false,
    premium: true,
  },
  {
    name: "Announcements",
    free: false,
    premium: true,
  },
  {
    name: "Fundraising tools",
    free: false,
    premium: true,
  },
];

/**
 * Plan pricing configuration
 */
export const PLAN_PRICING = {
  free: {
    amount: 0,
    name: "Basic",
    description: "Perfect for small organizations getting started",
  },
  premium: {
    amount: 49,
    name: "Premium",
    description: "Everything you need to manage and grow your organization",
  },
} as const;