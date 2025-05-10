'use server'

import { createAdminClient, createClient } from "@/utils/supabase/server";

export async function deleteUser(userId: string) {
  const supabase = await createClient();
  const { data: user_invite, error } = await supabase
    .from("users")
    .delete()
    .eq("id", userId)

  if (error) {
    console.log(error);
    return false;
  }

  const supabaseAdmin = await createAdminClient();
  await supabaseAdmin.auth.admin.deleteUser(userId);

  return true;
};

export async function deleteControl(id: string) {
  const supabase = await createClient();
  const { data: controls, error } = await supabase
    .from("controls")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    return false;
  }

  return true;
}