"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function auth() {
  const supabase = await createSupabaseServer();

  const { data, error: signUpError } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  return { url: data.url };
}

export async function logout() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
