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

export const accessModules = ["users", "roles", "dashboard", "systems", "controls", "clients", "sites", "evidence"] as const;
export const accessLevels = ["none", "read", "edit", "full"] as const;

export type AccessModule = typeof accessModules[number];
export type AccessLevel = typeof accessLevels[number];

// CONTROLS
export type EnforcementMethod = "manual" | "scripted" | "auto-scanned" | "vendor-managed";
export type ControlStatus = "draft" | "approved";
export type EvidenceType = "screenshot" | "log";
export type SiteControlStatus = 'onboarding' | 'implemented' | 'waived';