import { z } from "zod";

export const deleteFormSchema = z.object({
  id: z.string(),
  url: z.string().optional()
});

export type DeleteFormValues = z.infer<typeof deleteFormSchema>;

export const userFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  role_id: z.string(),
  send_email: z.boolean(),
  tenant_id: z.string()
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const editUserFormSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  role_id: z.string(),
  user_id: z.string()
});

export type EditUserFormValues = z.infer<typeof editUserFormSchema>;

export const inviteFormShema = z.object({
  password: z.string().min(12, { message: "Minimum of 12 characters" }),
  invite_id: z.string(),
});

export type InviteFormValues = z.infer<typeof inviteFormShema>;

export const signInFormSchema = z.object({
  password: z.string().min(1, { message: "Enter a password" }),
  email: z.string().email({ message: "Enter a valid email" }),
});

export type SignInFormValues = z.infer<typeof signInFormSchema>;

export const createRoleFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  user_access: z.string(),
  role_access: z.string(),
  dashboard_access: z.string(),
  tenant_id: z.string()
});

export type CreateRoleFormValues = z.infer<typeof createRoleFormSchema>;

export const editRoleFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  user_access: z.string(),
  role_access: z.string(),
  dashboard_access: z.string(),
  role_id: z.string()
});

export type EditRoleFormValues = z.infer<typeof editRoleFormSchema>;

export const systemFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  tenant_id: z.string(),
});

export type SystemFormValues = z.infer<typeof systemFormSchema>;

export const controlEvidenceSchema = z.object({
  type: z.string(),
  description: z.string(),
  location_hint: z.string().optional()
})

export const controlFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  system_id: z.string(),
  tenant_id: z.string(),
  control_code: z.string().min(1, { message: "Control Code is required" }),
  status: z.enum(["draft", "approved"] as const),
  revision: z.string().min(1, { message: "Revision is required" }),
  enforcement_method: z.enum(["manual", "scripted", "auto-scanned", "vendor-managed"] as const),
  enforcement_location: z.string().optional(),
});

export type ControlFormValues = z.infer<typeof controlFormSchema>;

export const evidencRequirementSchema = z.object({
  id: z.string().optional(),
  requirement_type: z.string(),
  description: z.string(),
  location_hint: z.string().optional()
});

export const controlEvidenceFormSchema = z.object({
  tenant_id: z.string(),
  control_id: z.string(),
  evidence: z.array(evidencRequirementSchema)
});

export type ControlEvidenceFormValues = z.infer<typeof controlEvidenceFormSchema>;

export const controlNstFormSchema = z.object({
  tenant_id: z.string(),
  control_id: z.string(),
  system_id: z.string(),
  nst_subcategories: z.array(z.string())
});

export type ControlNstFormValues = z.infer<typeof controlNstFormSchema>;

export const clientFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  tenant_id: z.string(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export const siteFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  tenant_id: z.string(),
  client_id: z.string()
});

export type SiteFormValues = z.infer<typeof siteFormSchema>;

export const siteSystemLinkFormSchema = z.object({
  id: z.string().optional(),
  tenant_id: z.string(),
  site_id: z.string(),
  system_id: z.array(z.string()),
});

export type SiteSystemLinkFormValues = z.infer<typeof siteSystemLinkFormSchema>;