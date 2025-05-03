import type { Roles, Tenants, UserInvites, Users } from "@/lib/schema/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getTenant(supabase: SupabaseClient) {
  const { data: tenant, error } = await supabase
    .from("tenants")
    .select("*")
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return tenant as Tenants;
}

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
}

export async function getRoles(supabase: SupabaseClient) {
  const { data: roles, error } = await supabase
    .from("roles")
    .select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return roles as Roles[];
}