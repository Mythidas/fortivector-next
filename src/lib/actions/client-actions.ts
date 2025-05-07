'use server'

import { createClient } from "@/utils/supabase/server";
import { clientFormSchema, siteFormSchema, siteSystemLinkFormSchema } from "../schema/forms";
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

export const createSiteSystemLinksAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = siteSystemLinkFormSchema.safeParse({
    site_id: params.get("site_id"),
    system_id: JSON.parse(params.get("system_id")?.toString() || "")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors, // easier to display on UI
      values: Object.fromEntries(params.entries()), // preserve filled data
    };
  }

  for await (const system of validation.data.system_id) {
    const { data, error } = await supabase.from("site_system").insert({
      site_id: validation.data.site_id,
      system_id: system
    }).select().single();

    if (error) {
      return {
        success: false,
        errors: { "db": [error.message] },
        values: Object.fromEntries(params.entries()), // preserve filled data
      }
    }

    const { data: controls } = await supabase.from("controls")
      .select("*")
      .eq("system_id", system);

    if (!controls) continue;

    for await (const control of controls) {
      await supabase.from("site_control").insert({
        site_id: validation.data.site_id,
        system_id: system,
        control_id: control.id
      });
    }
  }

  return redirect(`/clients/site/${validation.data.site_id}?tab=systems`);
};