'use server'

import { userFormSchema, deleteFormSchema } from "@/lib/schema/forms";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const createInviteAction = async (_prevState: any, params: FormData) => {
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

export const updateUserAction = async (_prevState: any, params: FormData) => {
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

export const deleteUserAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = deleteFormSchema.safeParse({
    id: params.get("id"),
    url: params.get("url")
  });

  if (validation.error) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      values: Object.fromEntries(params.entries())
    }
  }

  const { error } = await supabase.from("users").delete().eq("id", validation.data.id);

  if (error) {
    return {
      success: false,
      errors: { "db": [error.message] },
      values: Object.fromEntries(params.entries())
    }
  }

  const supabaseAdmin = await createAdminClient();
  await supabaseAdmin.auth.admin.deleteUser(validation.data.id);

  return redirect(validation.data.url || "/users");
};