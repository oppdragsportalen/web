"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function signUp() {
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
