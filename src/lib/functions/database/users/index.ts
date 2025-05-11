'use server'

import { UserInvites, Users } from "@/lib/schema/database/users";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getUsers(supabase: SupabaseClient) {
  const { data: users, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return users as Users[];
}

export async function getUser(supabase: SupabaseClient, id: string) {
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return users as Users;
}

export async function getUserInvites(supabase: SupabaseClient) {
  const { data: user_invites, error } = await supabase
    .from("user_invites")
    .select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return user_invites as UserInvites[];
}

export async function getUserInvite(supabase: SupabaseClient, inviteToken: string) {
  const { data: user_invite, error } = await supabase
    .from("user_invites")
    .select("*")
    .eq("invite_token", inviteToken)
    .single()
    .setHeader("invite-token", inviteToken);

  if (error) {
    console.log(error);
    return null;
  }

  return user_invite as UserInvites;
};

export async function deleteUserInvite(supabase: SupabaseClient, inviteId: string) {
  const { data: user_invite, error } = await supabase
    .from("user_invites")
    .delete()
    .eq("id", inviteId)

  if (error) {
    console.log(error);
    return false;
  }

  return true;
};

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