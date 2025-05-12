'use server'

import { createClient } from "@/utils/supabase/server";
import { clientFormSchema, controlEvidenceFormSchema, siteFormSchema, siteSystemLinkFormSchema } from "../schema/forms";
import { redirect } from "next/navigation";
import { z } from "zod";
import { randomUUID } from "node:crypto";

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

export const createControlEvidenceAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = controlEvidenceFormSchema.safeParse({
    id: params.get("id"),
    tenant_id: params.get("tenant_id"),
    site_id: params.get("site_id"),
    control_id: params.get("control_id"),
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
      site_id: validation.data.site_id,
      control_id: validation.data.control_id,
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
      errors: { "api": ["File failed to upload file."] },
      values: Object.fromEntries(params.entries()),
    };
  }

  return redirect(`/clients/control/${validation.data.id}?tab=evidence`);
}