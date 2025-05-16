// FORMS
export type FormState<Schema> = {
  success: boolean;
  errors?: Record<string, string[]>;
  values: Partial<Schema>;
  message?: string;
}
export type FormFooterProps = {
  cancel_route?: string;
  submit_text: string;
  pending_text: string;
}

export type Option = {
  id: string;
  label: string;
}

// ROLES

export const accessModules = ["users", "roles", "dashboard", "systems", "controls", "clients", "sites", "evidence", "waivers"] as const;
export const accessLevels = ["none", "read", "edit", "full"] as const;

export type AccessModule = typeof accessModules[number];
export type AccessLevel = typeof accessLevels[number];

// CONTROLS
export const evidenceStatus = ["pending", "approved", "denied"] as const;
export const waiverStatus = ["pending", "approved", "denied"] as const;

export type EnforcementMethod = "manual" | "scripted" | "auto-scanned" | "vendor-managed";
export type ControlStatus = "draft" | "approved";
export type EvidenceType = "screenshot" | "log";
export type SiteControlStatus = 'onboarding' | 'implemented' | 'waived';
export type EvidenceStatus = typeof evidenceStatus[number];
export type WaiverStatus = typeof waiverStatus[number];