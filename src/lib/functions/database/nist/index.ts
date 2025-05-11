'use server'

import { NSTFunctions, NSTSubcategories } from "@/lib/schema/database/nist";
import type { SupabaseClient } from "@supabase/supabase-js";

// NIST
export async function getNISTFunctions(supabase: SupabaseClient) {
  const { data: functions, error } = await supabase
    .from("nst_functions")
    .select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return functions as NSTFunctions[];
}

export async function getNISTSubcategories(supabase: SupabaseClient) {
  const { data: subcategories, error } = await supabase
    .from("nst_subcategories")
    .select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return subcategories as NSTSubcategories[];
}