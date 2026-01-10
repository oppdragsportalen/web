"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;

  if (!email || !password || !displayName) {
    return { error: "All fields required" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
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
  });

  if (profileError) {
    return { error: profileError.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
