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