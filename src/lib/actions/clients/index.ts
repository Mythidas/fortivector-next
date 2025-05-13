'use server'

import { clientFormSchema, deleteFormSchema } from "@/lib/schema/forms";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const createClientAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = clientFormSchema.safeParse({
    name: params.get("name"),
    tenant_id: params.get("tenant_id")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors, // easier to display on UI
      values: Object.fromEntries(params.entries()), // preserve filled data
    };
  }

  const { data, error } = await supabase.from("clients").insert({
    name: validation.data.name,
    tenant_id: validation.data.tenant_id
  }).select().single();

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries()), // preserve filled data
    }
  }

  return redirect(`/clients/${data.id}`);
};

export const updateClientAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = clientFormSchema.safeParse({
    id: params.get("id"),
    name: params.get("name"),
    tenant_id: params.get("tenant_id")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors, // easier to display on UI
      values: Object.fromEntries(params.entries()), // preserve filled data
    };
  }

  const { data, error } = await supabase.from("clients").update({
    name: validation.data.name,
  }).eq("id", validation.data.id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries()), // preserve filled data
    }
  }

  return redirect(`/clients/${validation.data.id}`);
};

export const deleteClientAciton = async (_prevState: any, params: FormData) => {
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

  const { error } = await supabase.from("clients").delete().eq("id", validation.data.id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries())
    }
  }

  return redirect(validation.data.url || "/clients");
};