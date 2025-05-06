// FORMS
export type FormState<Schema> = {
  success: boolean;
  errors?: Record<string, string[]>;
  values: Partial<Schema>;
}

// ROLES
export type AccessModule = "users" | "roles" | "dashboard" | "systems" | "controls";
export type AccessLevel = "none" | "read" | "edit" | "full";

// CONTROLS
export type EnforcementMethod = "manual" | "scripted" | "auto-scanned" | "vendor-managed";
export type ControlStatus = "draft" | "approved";
export type EvidenceRequirment = {
  type: string;
  description: string;
  location_hint?: string;
}