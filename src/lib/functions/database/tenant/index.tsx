'use server'

import { Tenants } from "@/lib/schema/database/tenants";
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