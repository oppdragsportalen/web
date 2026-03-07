"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;
  const username = (formData.get("username") as string)?.trim().toLowerCase();

  if (!email || !password || !displayName || !username) {
    return { error: "All fields required" };
  }

  if (!/^[a-z0-9_]{3,25}$/.test(username)) {
    return {
      error:
        "Username must be 3-25 characters and contain only letters, numbers, and underscores",
    };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  // Check if username is already taken
  const supabaseAdmin = createSupabaseAdmin();
  const { data: existingUser } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existingUser) {
    return { error: "Username is already taken" };
  }

  const supabase = await createSupabaseServer();

  // Sign up with Supabase
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  if (!data.user) {
    return { error: "Failed to create user" };
  }

  // Create profile
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    display_name: displayName,
    username,
  });

  if (profileError) {
    return { error: profileError.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
