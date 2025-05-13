'use server'

import { controlEvidenceFormSchema, controlEvidenceRequirementsFormSchema, controlFormSchema, controlNstFormSchema, deleteFormSchema } from "@/lib/schema/forms";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";

export const createControlAction = async (_prevState: any, params: FormData) => {
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

export const updateControlAction = async (_prevState: any, params: FormData) => {
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

export const deleteControlAciton = async (_prevState: any, params: FormData) => {
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

  const { error } = await supabase.from("controls").delete().eq("id", validation.data.id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries())
    }
  }

  return redirect(validation.data.url || "/systems");
};

export const updateEvidenceRequirementsAction = async (_prevState: any, params: FormData) => {
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

export const updateControlNistAction = async (_prevState: any, params: FormData) => {
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

export const createControlEvidenceAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = controlEvidenceFormSchema.safeParse({
    id: params.get("id"),
    tenant_id: params.get("tenant_id"),
    site_control_id: params.get("site_control_id"),
    evidence_requirement_id: params.get("evidence_requirement_id"),
    name: params.get("name"),
    description: params.get("description"),
    evidence_obj: params.get("evidence_obj"),
    uploaded_by: params.get("uploaded_by")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      values: Object.fromEntries(params.entries()),
    };
  }

  if (validation.data.evidence_obj) {
    const buffer = Buffer.from(await validation.data.evidence_obj.arrayBuffer());
    const type = validation.data.evidence_obj.type;
    const path = `public/${validation.data.tenant_id}/${randomUUID()}.${type.split("/").at(1)}`;

    const { data, error } = await supabase.storage
      .from('evidence')
      .upload(path, buffer, {
        contentType: type
      });

    if (error) {
      return {
        success: false,
        errors: { db: [error.message] },
        values: Object.fromEntries(params.entries()),
      };
    }

    const { error: evidence_error } = await supabase.from("control_evidence").insert({
      tenant_id: validation.data.tenant_id,
      site_control_id: validation.data.site_control_id,
      evidence_requirement_id: validation.data.evidence_requirement_id === "adhoc" ? null : validation.data.evidence_requirement_id,
      name: validation.data.name,
      description: validation.data.description,
      evidence_url: data.fullPath,
      uploaded_by: validation.data.uploaded_by
    })

    if (evidence_error) {
      return {
        success: false,
        errors: { db: [evidence_error.message] },
        values: Object.fromEntries(params.entries()),
      };
    }
  } else {
    return {
      success: false,
      errors: { db: ["File failed to upload file."] },
      values: Object.fromEntries(params.entries()),
    };
  }

  return redirect(`/clients/control/${validation.data.id}?tab=evidence`);
}

export const deleteControlEvidenceAction = async (_prevState: any, params: FormData) => {
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

  const { data } = await supabase.from("control_evidence").select().eq("id", validation.data.id).single();

  if (!data) {
    return {
      success: false,
      errors: { "db": ["Failed to find entry."] },
      values: Object.fromEntries(params.entries())
    }
  }


  const { data: files, error: evidencError } = await supabase.storage.from("evidence").remove([String(data.evidence_url).substring(9)]);

  if (evidencError || files.length === 0) {
    return {
      success: false,
      errors: { "db": ["Failed to delete evidence file."] },
      values: Object.fromEntries(params.entries())
    }
  }


  const { error } = await supabase.from("control_evidence").delete().eq("id", validation.data.id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries())
    }
  }

  return redirect(validation.data.url || "/clients");
};