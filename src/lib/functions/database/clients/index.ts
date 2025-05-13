'use server'

import { Clients } from "@/lib/schema/database/clients";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getClients(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("clients")
    .select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return data as Clients[];
}

export async function getClient(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return data as Clients;
}