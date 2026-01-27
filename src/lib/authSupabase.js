import { supabase } from "./supabaseClient";

export async function isSuperAdmin() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) return false;

  const { data, error: roleError } = await supabase
    .from("app_admins")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "SUPER_ADMIN")
    .single();

  if (roleError) return false;

  return true;
}
