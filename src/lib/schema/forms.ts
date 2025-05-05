import { z } from "zod";

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

export const createSystemFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  tenant_id: z.string()
});

export type CreateSystemFormValues = z.infer<typeof createSystemFormSchema>;

export const controlEvidenceSchema = z.object({
  type: z.string(),
  description: z.string(),
  location_hint: z.string().optional()
})

export const createControlFormSchema = z.object({
  title: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  system_id: z.string(),
  tenant_id: z.string(),
  control_code: z.string().min(1, { message: "Control Code is required" }),
  status: z.enum(["draft", "approved"] as const),
  revision: z.string().min(1, { message: "Revision is required" }),
  enforcement_method: z.enum(["manual", "scripted", "auto-scanned", "vendor-managed"] as const),
  enforcement_location: z.string().optional(),
  playbook_id: z.string().optional(),
  evidence_requirements: z.array(controlEvidenceSchema)
});

export type CreateControlFormValues = z.infer<typeof createControlFormSchema>;