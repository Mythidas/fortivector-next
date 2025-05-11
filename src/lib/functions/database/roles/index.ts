'use server'

import { Roles } from "@/lib/schema/database/roles";
import type { SupabaseClient } from "@supabase/supabase-js";

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