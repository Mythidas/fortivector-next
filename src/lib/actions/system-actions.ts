'use server'

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { controlEvidenceRequirementsFormSchema, ControlEvidenceRequirmentsFormValues, controlFormSchema, ControlFormValues, controlNstFormSchema, ControlNstFormValues, deleteFormSchema, systemFormSchema } from "@/lib/schema/forms";
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

export const deleteSystemAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = deleteFormSchema.safeParse({
    id: params.get("id"),
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors, // easier to display on UI
      values: Object.fromEntries(params.entries()), // preserve filled data
    };
  }

  const { data, error } = await supabase.from("systems").delete().eq('id', validation.data.id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries()), // preserve filled data
    }
  }

  return redirect(`/systems`);
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

  const { error: existsError } = await supabase.from("controls").select().eq("control_code", validation.data.control_code);
  if (!existsError) {
    return {
      success: false,
      errors: { "db": ["Control Code must be unique."] },
      values: Object.fromEntries(params.entries()), // preserve filled data
    }
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

export const deleteControlAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = deleteFormSchema.safeParse({
    id: params.get("id"),
    url: params.get("url")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors, // easier to display on UI
      values: Object.fromEntries(params.entries()), // preserve filled data
    };
  }

  const { data, error } = await supabase.from("controls").delete().eq('id', validation.data.id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries()), // preserve filled data
    }
  }

  return redirect(validation.data.url || `/systems`);
};

export const updateEvidenceRequirementsAction = async (_prevState: any, params: FormData): Promise<FormState<ControlEvidenceRequirmentsFormValues>> => {
  const supabase = await createClient();
  const validation = controlEvidenceRequirementsFormSchema.safeParse({
    tenant_id: params.get('tenant_id'),
    control_id: params.get('control_id'),
    evidence: JSON.parse(params.get('evidence')?.toString() || "[]")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors, // easier to display on UI
      values: Object.fromEntries(params.entries()), // preserve filled data
    };
  }

  const { data: existing, error: existing_error } = await supabase
    .from('control_evidence_requirements')
    .select()
    .eq("control_id", validation.data.control_id);

  if (existing_error) {
    return {
      success: false,
      errors: { "db": [existing_error.message] }, // easier to display on UI
      values: Object.fromEntries(params.entries()), // preserve filled data
    };
  }

  const delete_ids: string[] = [];
  for await (const evidence of existing) {
    const compare = validation.data.evidence.find((row) => row.id && row.id === evidence.id);
    if (!compare) {
      delete_ids.push(evidence.id);
    }
  }

  if (delete_ids) {
    await supabase.from('control_evidence_requirements').delete().in('id', delete_ids);
  }

  for await (const evidence of validation.data.evidence) {
    if (evidence.id) {
      const { data, error } = await supabase.from('control_evidence_requirements').update({
        requirement_type: evidence.requirement_type,
        description: evidence.description,
        location_hint: evidence.location_hint
      }).eq('id', evidence.id);
    } else {
      const { data, error } = await supabase.from('control_evidence_requirements').insert({
        tenant_id: validation.data.tenant_id,
        control_id: validation.data.control_id,
        requirement_type: evidence.requirement_type,
        description: evidence.description,
        location_hint: evidence.location_hint
      })

      if (error) {
        console.log(error);
      }
    }
  }

  redirect(`/systems/control/${validation.data.control_id}?tab=evidence`);
}

export const updateControlNistAction = async (_prevState: any, params: FormData): Promise<FormState<ControlNstFormValues>> => {
  const supabase = await createClient();
  const validation = controlNstFormSchema.safeParse({
    tenant_id: params.get('tenant_id'),
    control_id: params.get('control_id'),
    system_id: params.get('system_id'),
    nst_subcategories: JSON.parse(params.get('nst_subcategories')?.toString() || "[]")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors, // easier to display on UI
      values: Object.fromEntries(params.entries()), // preserve filled data
    };
  }

  const { data: existing, error: existing_error } = await supabase
    .from("controls_to_nst_subcategories")
    .select()
    .eq('control_id', validation.data.control_id);

  if (existing_error) {
    return {
      success: false,
      errors: { "db": [existing_error.message] }, // easier to display on UI
      values: Object.fromEntries(params.entries()), // preserve filled data
    };
  }

  await supabase.from('controls_to_nst_subcategories').delete().eq("control_id", validation.data.control_id);

  for await (const subcat of validation.data.nst_subcategories) {
    await supabase.from("controls_to_nst_subcategories").insert({
      control_id: validation.data.control_id,
      system_id: validation.data.system_id,
      tenant_id: validation.data.tenant_id,
      subcategory_id: subcat
    })
  }

  redirect(`/systems/control/${validation.data.control_id}?tab=nist`);
}