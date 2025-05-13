'use server'

import { deleteFormSchema, roleFormSchema } from "@/lib/schema/forms";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const createRoleAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = roleFormSchema.safeParse({
    name: params.get("name"),
    description: params.get("description"),
    tenant_id: params.get("tenant_id"),
    access_rights: JSON.parse(params.get("access_rights")?.toString() || "{}")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      values: Object.fromEntries(params.entries())
    }
  }

  const { data, error } = await supabase.from("roles").insert({
    name: validation.data.name,
    description: validation.data.description,
    tenant_id: validation.data.tenant_id,
    access_rights: validation.data.access_rights
  })

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries())
    }
  }

  return redirect("/users?tab=roles");
};

export const updateRoleAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = roleFormSchema.safeParse({
    name: params.get("name"),
    description: params.get("description"),
    role_id: params.get("role_id"),
    access_rights: JSON.parse(params.get("access_rights")?.toString() || "{}")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      values: Object.fromEntries(params.entries())
    }
  }

  const { error } = await supabase.from("roles").update({
    name: validation.data.name,
    description: validation.data.description,
    access_rights: validation.data.access_rights
  }).eq("id", validation.data.id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries())
    }
  }

  return redirect("/users?tab=roles");
};

export const deleteRoleAciton = async (_prevState: any, params: FormData) => {
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

  const { error } = await supabase.from("roles").delete().eq("id", validation.data.id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries())
    }
  }

  return redirect(validation.data.url || "/users?tab=roles");
};