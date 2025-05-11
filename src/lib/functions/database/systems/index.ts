'use server'

import { Systems } from "@/lib/schema/database/systems";
import type { SupabaseClient } from "@supabase/supabase-js";

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