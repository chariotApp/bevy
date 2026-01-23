// src/lib/supabase/queries/treasury.ts
import { SupabaseClient } from "@supabase/supabase-js";

export interface PaymentClassData {
  organization_id: string;
  class_name: string;
  display_name: string;
  dues_amount: number;
  billing_frequency: string;
  is_active: boolean;
}

export interface UpdatePaymentClassData {
  class_name?: string;
  display_name?: string;
  dues_amount?: number;
  billing_frequency?: string;
}

/**
 * Fetch all active payment classes for an organization
 */
export async function fetchPaymentClasses(
  supabase: SupabaseClient,
  organizationId: string
) {
  const { data, error } = await supabase
    .from("organization_payment_classes")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch payment classes: ${error.message}`);
  }

  return data;
}

/**
 * Fetch all memberships for an organization
 */
export async function fetchMemberships(
  supabase: SupabaseClient,
  organizationId: string
) {
  const { data, error } = await supabase
    .from("organization_memberships")
    .select("user_id, role, payment_class")
    .eq("organization_id", organizationId);

  if (error) {
    throw new Error(`Failed to fetch memberships: ${error.message}`);
  }

  return data;
}

/**
 * Fetch profiles for given user IDs
 */
export async function fetchProfiles(
  supabase: SupabaseClient,
  userIds: string[]
) {
  if (userIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds);

  if (error) {
    throw new Error(`Failed to fetch profiles: ${error.message}`);
  }

  return data;
}

/**
 * Create a new payment class
 */
export async function createPaymentClass(
  supabase: SupabaseClient,
  paymentClassData: PaymentClassData
) {
  const { data, error } = await supabase
    .from("organization_payment_classes")
    .insert(paymentClassData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create payment class: ${error.message}`);
  }

  return data;
}

/**
 * Update an existing payment class
 */
export async function updatePaymentClass(
  supabase: SupabaseClient,
  classId: string,
  updates: UpdatePaymentClassData
) {
  const { data, error } = await supabase
    .from("organization_payment_classes")
    .update(updates)
    .eq("id", classId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update payment class: ${error.message}`);
  }

  return data;
}

/**
 * Soft delete a payment class (set is_active to false)
 */
export async function deletePaymentClass(
  supabase: SupabaseClient,
  classId: string
) {
  const { error } = await supabase
    .from("organization_payment_classes")
    .update({ is_active: false })
    .eq("id", classId);

  if (error) {
    throw new Error(`Failed to delete payment class: ${error.message}`);
  }
}

/**
 * Fetch user's membership in an organization
 */
export async function fetchUserMembership(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("organization_memberships")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch user membership: ${error.message}`);
  }

  return data;
}

/**
 * Check if user is admin of an organization
 */
export async function isUserAdmin(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string
): Promise<boolean> {
  try {
    const membership = await fetchUserMembership(supabase, organizationId, userId);
    return membership.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Fetch payment transactions for a member
 */
export async function fetchMemberTransactions(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("payment_transactions")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  return data;
}

/**
 * Calculate member's current balance
 */
export async function calculateMemberBalance(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string
): Promise<number> {
  const transactions = await fetchMemberTransactions(
    supabase,
    organizationId,
    userId
  );

  return transactions.reduce((balance, transaction) => {
    if (transaction.type === "charge" || transaction.type === "dues") {
      return balance + transaction.amount;
    } else if (transaction.type === "payment") {
      return balance - transaction.amount;
    }
    return balance;
  }, 0);
}

/**
 * Fetch all members with their balances
 */
export async function fetchMembersWithBalances(
  supabase: SupabaseClient,
  organizationId: string
) {
  const memberships = await fetchMemberships(supabase, organizationId);
  const userIds = memberships.map((m) => m.user_id);
  const profiles = await fetchProfiles(supabase, userIds);

  const membersWithBalances = await Promise.all(
    profiles.map(async (profile) => {
      const membership = memberships.find((m) => m.user_id === profile.id);
      const balance = await calculateMemberBalance(
        supabase,
        organizationId,
        profile.id
      );

      return {
        id: profile.id,
        full_name: profile.full_name || "Unnamed User",
        payment_class: membership?.payment_class || "general_member",
        role: membership?.role || "member",
        balance,
      };
    })
  );

  return membersWithBalances;
}