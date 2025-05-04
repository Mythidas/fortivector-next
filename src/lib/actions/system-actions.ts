'use server'

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createControlFormSchema, createRoleFormSchema, createSystemFormSchema, editRoleFormSchema, editUserFormSchema, userFormSchema } from "@/lib/schema/forms";

export const createSystemAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = createSystemFormSchema.safeParse({
    name: params.get("name"),
    description: params.get("description"),
    tenant_id: params.get("tenant_id")
  });

  if (validation.error) {
    return encodedRedirect("error", "/systems/create", validation.error.message);
  }

  const { data, error } = await supabase.from("systems").insert({
    name: validation.data.name,
    description: validation.data.description,
    tenant_id: validation.data.tenant_id
  }).select().single();

  if (error) {
    return encodedRedirect("error", "/systems/create", error.message);
  }

  return redirect(`/systems/${data.id}`);
};

export const createControlAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = createControlFormSchema.safeParse({
    name: params.get("name"),
    description: params.get("description"),
    system_id: params.get("system_id")
  });

  if (validation.error) {
    return encodedRedirect("error", "/systems/create", validation.error.message);
  }

  const { data, error } = await supabase.from("systems").insert({
    name: validation.data.name,
    description: validation.data.description,
    system_id: validation.data.system_id
  }).select().single();

  if (error) {
    return encodedRedirect("error", "/systems/create", error.message);
  }

  return redirect(`/systems/${data.id}`);
};