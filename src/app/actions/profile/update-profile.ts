"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const displayName = formData.get("displayName") as string;
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const newEmail = (formData.get("email") as string) || null;

  if (!displayName || displayName.length < 2) {
    return { error: "Name must be at least 2 characters" };
  }

  if (!username || !/^[a-z0-9_]{3,25}$/.test(username)) {
    return {
      error:
        "Username must be 3-25 characters and contain only letters, numbers, and underscores",
    };
  }

  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  if (newEmail && newEmail !== user.email) {
    return {
      error: "Email change is temporarily disabled.",
    };
  }

  // Check username availability
  const { data: conflictingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", user.id)
    .maybeSingle();

  if (conflictingProfile) {
    return { error: "Username is already taken" };
  }

  const updatePayload: { email?: string; data: Record<string, unknown> } = {
    data: { display_name: displayName },
  };

  if (newEmail && newEmail !== user.email) {
    updatePayload.email = newEmail;
  }

  const { data: authData, error: authError } =
    await supabase.auth.updateUser(updatePayload);

  if (authError) {
    return { error: authError.message };
  }

  let emailUpdatePending = false;
  if (updatePayload.email && authData?.user) {
    emailUpdatePending = authData.user.email !== updatePayload.email;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName, username })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { success: true, emailUpdatePending };
}
