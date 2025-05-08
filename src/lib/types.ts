// FORMS
export type FormState<Schema> = {
  success: boolean;
  errors?: Record<string, string[]>;
  values: Partial<Schema>;
}
export type FormFooterProps = {
  cancel_route?: string;
  submit_text: string;
  pending_text: string;
}

// ROLES
export type AccessModule = "users" | "roles" | "dashboard" | "systems" | "controls" | "clients" | "sites";
export type AccessLevel = "none" | "read" | "edit" | "full";

// CONTROLS
export type EnforcementMethod = "manual" | "scripted" | "auto-scanned" | "vendor-managed";
export type ControlStatus = "draft" | "approved";
export type EvidenceType = "screenshot" | "log";