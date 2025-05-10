'use server'

import { createAdminClient, createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createRoleFormSchema, editRoleFormSchema, userFormSchema, UserFormValues } from "@/lib/schema/forms";
import { FormState } from "@/lib/types";

export const createInviteAction = async (_prevState: any, params: FormData): Promise<FormState<UserFormValues>> => {
  const supabase = await createClient();
  const validation = userFormSchema.safeParse({
    first_name: params.get("first_name"),
    last_name: params.get("last_name"),
    email: params.get("email"),
    role_id: params.get("role_id"),
    tenant_id: params.get("tenant_id"),
    send_email: params.get("send_email") === "on"
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error?.flatten().fieldErrors,
      values: Object.fromEntries(params.entries())
    }
  }

  const { error } = await supabase.from("user_invites").insert({
    first_name: validation.data.first_name,
    last_name: validation.data.last_name,
    email: validation.data.email,
    role_id: validation.data.role_id,
    tenant_id: validation.data.tenant_id
  });

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries())
    }
  }

  if (validation.data.send_email) {
    // TODO: send email with link
  }

  return redirect("/users?tab=invites");
};

export const editUserAction = async (_prevState: any, params: FormData): Promise<FormState<UserFormValues>> => {
  const supabase = await createClient();
  const validation = userFormSchema.safeParse({
    id: params.get("id"),
    first_name: params.get("first_name"),
    last_name: params.get("last_name"),
    role_id: params.get("role_id"),
    user_id: params.get("user_id"),
    email: params.get("email")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      values: Object.fromEntries(params.entries())
    }
  }

  const { error } = await supabase.from("users").update({
    first_name: validation.data.first_name,
    last_name: validation.data.last_name,
    role_id: validation.data.role_id,
  }).eq("id", validation.data.id);

  const supabaseAdmin = await createAdminClient();
  await supabaseAdmin.auth.admin.updateUserById(validation.data.id || "", {
    app_metadata: {
      "role_id": validation.data.role_id
    }
  })

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries())
    }
  }

  return redirect("/users");
};

export const createRoleAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = createRoleFormSchema.safeParse({
    name: params.get("name"),
    description: params.get("description"),
    user_access: params.get("user_access"),
    role_access: params.get("role_access"),
    dashboard_access: params.get("dashboard_access"),
    tenant_id: params.get("tenant_id"),
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      values: Object.fromEntries(params.entries())
    }
  }

  const { data, error } = await supabase.from("roles").insert({
    name: validation.data.name,
    description: validation.data.description,
    tenant_id: validation.data.tenant_id,
    access_rights: {
      users: validation.data.user_access,
      roles: validation.data.role_access,
      dashboard: validation.data.dashboard_access
    }
  })

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries())
    }
  }

  return redirect("/users?tab=roles");
};

export const editRoleAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = editRoleFormSchema.safeParse({
    name: params.get("name"),
    description: params.get("description"),
    user_access: params.get("user_access"),
    role_access: params.get("role_access"),
    dashboard_access: params.get("dashboard_access"),
    role_id: params.get("role_id"),
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      values: Object.fromEntries(params.entries())
    }
  }

  const access_rights = {
    users: validation.data.user_access,
    roles: validation.data.role_access,
    dashboard: validation.data.dashboard_access
  }

  const { error } = await supabase.from("roles").update({
    name: validation.data.name,
    description: validation.data.description,
    access_rights: access_rights
  }).eq("id", validation.data.role_id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries())
    }
  }

  return redirect("/users?tab=roles");
};