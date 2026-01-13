"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const displayName = formData.get("displayName") as string;

  if (!displayName || displayName.length < 2) {
    return { error: "Name must be at least 2 characters" };
  }

  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}
