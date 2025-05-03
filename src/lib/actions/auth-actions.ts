"use server";

import { encodedRedirect } from "@/utils/utils";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserInvite } from "../server/db";
import { inviteFormShema } from "../schema/forms";

export const registerAction = async (_prevState: any, params: FormData) => {
  const supabase = await createClient();
  const validation = inviteFormShema.safeParse({
    password: params.get("password"),
    invite_id: params.get("invite_id")
  });

  if (validation.error) {
    return encodedRedirect("error", `/auth/sign-up?invite=${params.get("invite_id")}&`, validation.error.message);
  }

  const invite = await getUserInvite(supabase, validation.data.invite_id);

  if (!invite) {
    return encodedRedirect("error", "/auth/sign-up", "Failed to fetch invite");
  }

  const { data, error } = await supabase.auth.signUp({
    email: invite.email,
    password: validation.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/auth/sign-up", error.message);
  } else {
    if (data.user) {
      const supabaseAdmin = await createAdminClient();
      const { data: user, error } = await supabaseAdmin.from("users").select().eq("id", data.user.id).single();
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        app_metadata: {
          "tenant_id": user.tenant_id
        }
      })
    }

    return encodedRedirect("success", "/auth/sign-up", "Thank you for Registering! Check your email for a confirmation.");
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/auth/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/auth/sign-in");
};