'use server'

import type { Roles, Systems, Tenants, UserInvites, Users } from "@/lib/schema/database";
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

export async function getRole(supabase: SupabaseClient, id: string) {
  const { data: roles, error } = await supabase
    .from("roles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return roles as Roles;
}

export async function getSystems(supabase: SupabaseClient) {
  const { data: systems, error } = await supabase
    .from("systems")
    .select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return systems as Systems[];
}

export async function getSystem(supabase: SupabaseClient, id: string) {
  const { data: systems, error } = await supabase
    .from("systems")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return systems as Systems;
}