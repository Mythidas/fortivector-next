'use server'

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { controlFormSchema, ControlFormValues, systemFormSchema } from "@/lib/schema/forms";
import { FormState } from "../types";

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

export const editSystemAction = async (_prevState: any, params: FormData) => {
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

export const createControlAction = async (_prevState: any, params: FormData): Promise<FormState<ControlFormValues>> => {
  const supabase = await createClient();
  const validation = controlFormSchema.safeParse({
    title: params.get("title"),
    description: params.get("description"),
    system_id: params.get("system_id"),
    tenant_id: params.get("tenant_id"),
    control_code: params.get("control_code"),
    status: params.get("status"),
    revision: params.get("revision"),
    enforcement_method: params.get("enforcement_method"),
    enforcement_location: params.get("enforcement_location"),
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors, // easier to display on UI
      values: Object.fromEntries(params.entries()), // preserve filled data
    };
  }

  const { data, error } = await supabase.from("controls").insert({
    title: validation.data.title,
    description: validation.data.description,
    system_id: validation.data.system_id,
    tenant_id: validation.data.tenant_id,
    control_code: validation.data.control_code,
    status: validation.data.status,
    revision: validation.data.revision,
    enforcement_method: validation.data.enforcement_method,
    enforcement_location: validation.data.enforcement_location,
  }).select().single();

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries()), // preserve filled data
    }
  }

  redirect(`/systems/${validation.data.system_id}?tab=controls`);
};

export const editControlAction = async (_prevState: any, params: FormData): Promise<FormState<ControlFormValues>> => {
  const supabase = await createClient();
  const validation = controlFormSchema.safeParse({
    id: params.get("id"),
    title: params.get("title"),
    description: params.get("description"),
    system_id: params.get("system_id"),
    tenant_id: params.get("tenant_id"),
    control_code: params.get("control_code"),
    status: params.get("status"),
    revision: params.get("revision"),
    enforcement_method: params.get("enforcement_method"),
    enforcement_location: params.get("enforcement_location"),
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors, // easier to display on UI
      values: Object.fromEntries(params.entries()), // preserve filled data
    };
  }

  const { error } = await supabase.from("controls").update({
    title: validation.data.title,
    description: validation.data.description,
    control_code: validation.data.control_code,
    status: validation.data.status,
    revision: validation.data.revision,
    enforcement_method: validation.data.enforcement_method,
    enforcement_location: validation.data.enforcement_location,
  }).eq("id", validation.data.id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries()), // preserve filled data
    }
  }

  redirect(`/systems/control/${validation.data.id}?tab=settings`);
};