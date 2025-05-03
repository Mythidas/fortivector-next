'use server'

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createRoleFormSchema, editRoleFormSchema, editUserFormSchema, userFormSchema } from "@/lib/schema/forms";

export const createSystemAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
}

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
    return encodedRedirect("error", "/users/create-user", validation.error.message);
  }

  const { data, error } = await supabase.from("user_invites").insert({
    first_name: validation.data.first_name,
    last_name: validation.data.last_name,
    email: validation.data.email,
    role_id: validation.data.role_id,
    tenant_id: validation.data.tenant_id
  });

  if (error) {
    return encodedRedirect("error", "/users/create-user", error.message);
  }

  if (validation.data.send_email) {
    // send email with link
  }

  return redirect("/users?tab=invites");
};