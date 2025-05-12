'use server'

import { Clients } from "@/lib/schema/database/clients";
import { Sites } from "@/lib/schema/database/sites";
import { SiteSystemsView } from "@/lib/schema/views";
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

export async function getSites(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("client_id", id);

  if (error) {
    console.log(error);
    return [];
  }

  return data as Sites[];
}

export async function getSite(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return data as Sites;
}

export async function getSiteSytemViews(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("site_systems_view")
    .select("*")
    .eq("site_id", id);

  if (error) {
    console.log(error);
    return [];
  }

  return data as SiteSystemsView[];
}

export async function getSiteSytemView(supabase: SupabaseClient, link_id: string) {
  const { data, error } = await supabase
    .from("site_systems_view")
    .select("*")
    .eq("link_id", link_id)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return data as SiteSystemsView;
}