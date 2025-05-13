'use server'

import { deleteFormSchema, systemFormSchema } from "@/lib/schema/forms";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const createSystemAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = systemFormSchema.safeParse({
    name: params.get("name"),
    description: params.get("description"),
    tenant_id: params.get("tenant_id")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors, // easier to display on UI
      values: Object.fromEntries(params.entries()), // preserve filled data
    };
  }

  const { data, error } = await supabase.from("systems").insert({
    name: validation.data.name,
    description: validation.data.description,
    tenant_id: validation.data.tenant_id
  }).select().single();

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries()), // preserve filled data
    }
  }

  return redirect(`/systems/${data.id}`);
};

export const updateSystemAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = systemFormSchema.safeParse({
    id: params.get("id"),
    name: params.get("name"),
    description: params.get("description"),
    tenant_id: params.get("tenant_id")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors, // easier to display on UI
      values: Object.fromEntries(params.entries()), // preserve filled data
    };
  }

  const { data, error } = await supabase.from("systems").update({
    name: validation.data.name,
    description: validation.data.description,
  }).eq("id", validation.data.id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries()), // preserve filled data
    }
  }

  return redirect(`/systems/${validation.data.id}?tab=settings`);
};

export const deleteSystemAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = deleteFormSchema.safeParse({
    id: params.get("id"),
    url: params.get("url")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      values: Object.fromEntries(params.entries())
    }
  }

  const { error } = await supabase.from("systems").delete().eq("id", validation.data.id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries())
    }
  }

  return redirect(validation.data.url || "/systems");
};