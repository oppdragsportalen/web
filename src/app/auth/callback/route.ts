import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

function generateUsername(base: string, existing: Set<string>) {
  const username = base.toLowerCase().replace(/[^a-z0-9]/g, "");
  let final = username;
  let i = 1;
  while (existing.has(final)) {
    final = `${username}${i}`;
    i++;
  }

  return final;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  const supabase = await createSupabaseServer();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(new URL("/", url.origin));
  }

  const user = data.user;
  const admin = createSupabaseAdmin();

  // Check if profile already exists
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    // Collect taken usernames
    const { data: takenUsernames } = await admin
      .from("profiles")
      .select("username");
    const taken = new Set((takenUsernames ?? []).map((p) => p.username));

    const base =
      user.user_metadata?.user_name || user.email?.split("@")[0] || "user";

    const username = generateUsername(base, taken);

    // Create profile
    await admin.from("profiles").insert({
      id: user.id,
      username: username,
      display_name:
        user.user_metadata?.full_name || user.user_metadata?.name || base,
      avatar_url: user.user_metadata?.avatar_url,
    });
  }

  return NextResponse.redirect(new URL("/dashboard", url.origin));
}
