'use server'

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createControlFormSchema, CreateControlFormValues, createRoleFormSchema, createSystemFormSchema, editRoleFormSchema, editUserFormSchema, userFormSchema } from "@/lib/schema/forms";
import { FormState } from "../types";

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

export const createControlAction = async (_prevState: any, params: FormData): Promise<FormState<CreateControlFormValues>> => {
  const supabase = await createClient();
  const validation = createControlFormSchema.safeParse({
    title: params.get("title"),
    description: params.get("description"),
    system_id: params.get("system_id"),
    tenant_id: params.get("tenant_id"),
    control_code: params.get("control_code"),
    status: params.get("status"),
    revision: params.get("revision"),
    enforcement_method: params.get("enforcement_method"),
    enforcement_location: params.get("enforcement_location"),
    playbook_id: params.get("playbook_id") || undefined,
    evidence_requirements: JSON.parse(params.get("evidence_requirements")?.toString() || ""),
    nst_subcategories: JSON.parse(params.get("nst_subcategories")?.toString() || "")
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
    playbook_id: validation.data.playbook_id,
    evidence_requirements: validation.data.evidence_requirements
  }).select().single();

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries()), // preserve filled data
    }
  }

  for await (const subcategory_id of validation.data.nst_subcategories) {
    const { error } = await supabase.from("controls_to_nst_subcategories").insert({
      control_id: data.id,
      subcategory_id
    })

    if (error) {
      console.log(error);
    }
  }

  redirect(`/systems/${validation.data.system_id}?tab=controls`);
};