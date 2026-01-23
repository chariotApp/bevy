// src/types/balance.types.ts

export interface Fee {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: "pending" | "paid";
  user_id?: string;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BalanceSummary {
  totalBalance: number;
  pendingFees: Fee[];
  paidFees: Fee[];
  totalPending: number;
  totalPaid: number;
}

export interface UserBalance {
  userId: string;
  userName: string;
  isAdmin: boolean;
  fees: Fee[];
  totalBalance: number;
}

export type FeeStatus = "pending" | "paid";

export interface FeeFilters {
  status?: FeeStatus;
  dateFrom?: string;
  dateTo?: string;
}