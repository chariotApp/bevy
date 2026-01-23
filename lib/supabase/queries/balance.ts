// src/lib/supabase/queries/balance.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { Fee } from "@/types/balance.types";

/**
 * Fetch user's profile information
 */
export async function fetchUserProfile(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }

  return data;
}

/**
 * Check if user is admin of an organization
 */
export async function checkUserAdminStatus(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("organization_memberships")
    .select("role")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error checking admin status:", error);
    return false;
  }

  return data?.role === "admin";
}

/**
 * Fetch all fees for a user in an organization
 */
export async function fetchUserFees(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string
): Promise<Fee[]> {
  const { data, error } = await supabase
    .from("fees")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch user fees: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch pending fees for a user
 */
export async function fetchPendingFees(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string
): Promise<Fee[]> {
  const { data, error } = await supabase
    .from("fees")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .eq("status", "pending")
    .order("date", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch pending fees: ${error.message}`);
  }

  return data || [];
}

/**
 * Mark a fee as paid
 */
export async function markFeeAsPaid(
  supabase: SupabaseClient,
  feeId: string
) {
  const { data, error } = await supabase
    .from("fees")
    .update({ status: "paid", updated_at: new Date().toISOString() })
    .eq("id", feeId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to mark fee as paid: ${error.message}`);
  }

  return data;
}

/**
 * Create a new fee for a user
 */
export async function createFee(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string,
  feeData: {
    description: string;
    amount: number;
    date: string;
    status?: "pending" | "paid";
  }
) {
  const { data, error } = await supabase
    .from("fees")
    .insert({
      organization_id: organizationId,
      user_id: userId,
      ...feeData,
      status: feeData.status || "pending",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create fee: ${error.message}`);
  }

  return data;
}

/**
 * Delete a fee
 */
export async function deleteFee(
  supabase: SupabaseClient,
  feeId: string
) {
  const { error } = await supabase
    .from("fees")
    .delete()
    .eq("id", feeId);

  if (error) {
    throw new Error(`Failed to delete fee: ${error.message}`);
  }
}