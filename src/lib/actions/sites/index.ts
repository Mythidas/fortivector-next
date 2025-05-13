'use server'

import { deleteFormSchema, siteFormSchema, siteSystemLinkFormSchema } from "@/lib/schema/forms";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const createSiteAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = siteFormSchema.safeParse({
    name: params.get("name"),
    tenant_id: params.get("tenant_id"),
    client_id: params.get("client_id")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors, // easier to display on UI
      values: Object.fromEntries(params.entries()), // preserve filled data
    };
  }

  const { data, error } = await supabase.from("sites").insert({
    name: validation.data.name,
    tenant_id: validation.data.tenant_id,
    client_id: validation.data.client_id
  }).select().single();

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries()), // preserve filled data
    }
  }

  return redirect(`/clients/site/${data.id}`);
};

export const deleteSiteAction = async (_prevState: any, params: FormData) => {
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

  const { error } = await supabase.from("sites").delete().eq("id", validation.data.id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries())
    }
  }

  return redirect(validation.data.url || "/clients");
};

export const createSiteSystemLinkAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = siteSystemLinkFormSchema.safeParse({
    tenant_id: params.get("tenant_id"),
    site_id: params.get("site_id"),
    system_id: JSON.parse(params.get("system_id")?.toString() || "")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      values: Object.fromEntries(params.entries()),
    };
  }

  for await (const system of validation.data.system_id) {
    const { error } = await supabase.from("site_systems").insert({
      site_id: validation.data.site_id,
      system_id: system,
      tenant_id: validation.data.tenant_id
    });

    if (error) {
      return {
        success: false,
        errors: { db: [error.message] },
        values: Object.fromEntries(params.entries()),
      };
    }
  }

  return redirect(`/clients/site/${validation.data.site_id}?tab=systems`);
};

export const deleteSiteSystemLinkAction = async (_prevState: any, params: FormData) => {
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

  const { error } = await supabase.from("site_systems").delete().eq("id", validation.data.id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries())
    }
  }

  return redirect(validation.data.url || "/clients");
};