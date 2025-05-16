'use server'

import { ControlEvidenceRequirements, Controls, ControlsToNSTSubcategories, ControlWaivers, ControlWaiversView } from "@/lib/schema/database/controls";
import { ControlEvidenceView, SiteControlsView } from "@/lib/schema/views";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getControls(supabase: SupabaseClient) {
  const { data: controls, error } = await supabase
    .from("controls")
    .select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return controls as Controls[];
}

export async function getControlsBySystem(supabase: SupabaseClient, system_id: string) {
  const { data: controls, error } = await supabase
    .from("controls")
    .select("*")
    .eq("system_id", system_id);

  if (error) {
    console.log(error);
    return [];
  }

  return controls as Controls[];
}

export async function getControl(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("controls")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return data as Controls;
}

export async function deleteControl(supabase: SupabaseClient, id: string) {
  const { data: controls, error } = await supabase
    .from("controls")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    return false;
  }

  return true;
}

export async function getControlEvidenceRequirements(supabase: SupabaseClient, control_id: string) {
  const { data: controls, error } = await supabase
    .from("control_evidence_requirements")
    .select("*")
    .eq('control_id', control_id);

  if (error) {
    console.log(error);
    return [];
  }

  return controls as ControlEvidenceRequirements[];
}

export async function getControlsEvidenceRequirements(supabase: SupabaseClient, control_id: string[]) {
  const { data: controls, error } = await supabase
    .from("control_evidence_requirements")
    .select("*")
    .in('control_id', control_id);

  if (error) {
    console.log(error);
    return [];
  }

  return controls as ControlEvidenceRequirements[];
}

export async function getSiteControlsView(supabase: SupabaseClient, site_id: string, site_system_id: string) {
  const { data: controls, error } = await supabase
    .from("site_controls_view")
    .select("*")
    .eq("site_id", site_id)
    .eq("site_system_id", site_system_id)
    .neq("control_status", "draft");

  if (error) {
    console.log(error);
    return [];
  }

  return controls as SiteControlsView[];
}

export async function getSiteControlView(supabase: SupabaseClient, site_control_id: string) {
  const { data: controls, error } = await supabase
    .from("site_controls_view")
    .select("*")
    .eq("site_control_id", site_control_id)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return controls as SiteControlsView;
}

export async function getControlEvidenceView(supabase: SupabaseClient, id: string) {
  const { data: controls, error } = await supabase
    .from("control_evidence_view")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return controls as ControlEvidenceView;
}

export async function getControlEvidenceViewBySiteAndControl(supabase: SupabaseClient, control_id: string, site_id: string) {
  const { data: controls, error } = await supabase
    .from("control_evidence_view")
    .select("*")
    .eq("site_id", site_id)
    .eq("control_id", control_id);

  if (error) {
    console.log(error);
    return [];
  }

  return controls as ControlEvidenceView[];
}

export async function getControlWaiversViewByControl(supabase: SupabaseClient, site_control_id: string) {
  const { data: controls, error } = await supabase
    .from("control_waivers_view")
    .select("*")
    .eq("site_control_id", site_control_id);

  if (error) {
    console.log(error);
    return [];
  }

  return controls as ControlWaiversView[];
}

export async function getControlWaiversView(supabase: SupabaseClient, id: string) {
  const { data: controls, error } = await supabase
    .from("control_waivers_view")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return controls as ControlWaiversView;
}

export async function getControlsToNSTSubcategories(supabase: SupabaseClient) {
  const { data: maps, error } = await supabase
    .from("controls_to_nst_subcategories")
    .select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return maps as ControlsToNSTSubcategories[];
}

export async function getControlToNSTSubcategories(supabase: SupabaseClient, control_id: string) {
  const { data: maps, error } = await supabase
    .from("controls_to_nst_subcategories")
    .select("*")
    .eq("control_id", control_id);

  if (error) {
    console.log(error);
    return [];
  }

  return maps as ControlsToNSTSubcategories[];
}