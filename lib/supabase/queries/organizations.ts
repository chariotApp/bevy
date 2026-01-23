import { createClient } from "@/lib/supabase/client";

export async function upgradeOrganizationToPremium(organizationId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("organizations")
    .update({ plan: "premium" })
    .eq("id", organizationId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to upgrade organization: ${error.message}`);
  }

  return data;
}