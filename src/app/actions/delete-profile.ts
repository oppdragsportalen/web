"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function DeleteProfile(formData: FormData) {
  const password = (formData.get("password") as string) ?? "";
  if (!password) {
    return { error: "Password is required" };
  }

  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  // Verify password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });

  if (signInError) {
    return { error: "Invalid password" };
  }

  const admin = createSupabaseAdmin();

  // Delete all assignments created by this user and related claim rows
  const { error: claimsError } = await admin
    .from("assignment_claims")
    .delete()
    .eq("user_id", user.id);

  if (claimsError) {
    return { error: "Failed to delete assignment claims" };
  }

  // Delete allowed-user rows linked to the user
  const { error: allowedError } = await admin
    .from("assignment_allowed_users")
    .delete()
    .eq("user_id", user.id);

  if (allowedError) {
    return { error: "Failed to delete assignment access entries" };
  }

  const { error: assignmentsError } = await admin
    .from("assignments")
    .delete()
    .eq("creator_id", user.id);

  if (assignmentsError) {
    return { error: "Failed to delete assignments" };
  }

  // Delete the user's profile
  const { error: profileError } = await admin
    .from("profiles")
    .delete()
    .eq("id", user.id);

  if (profileError) {
    return { error: "Failed to delete profile" };
  }

  // Delete the user account
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return { error: "Failed to delete account" };
  }

  revalidatePath("/");
  redirect("/");
}
