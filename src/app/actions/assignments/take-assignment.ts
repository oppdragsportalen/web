"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function TakeAssignment(formData: FormData) {
  const assignmentId = formData.get("assignmentId") as string;

  if (!assignmentId) {
    return { error: "Assignment ID is required" };
  }

  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  const { data: assignment, error: assignmentError } = await supabase
    .from("assignments")
    .select("id, visibility, creator_id")
    .eq("id", assignmentId)
    .single();

  if (assignmentError || !assignment) {
    return { error: "Assignment not found" };
  }

  // Check if user is allowed to take this assignment
  if (assignment.visibility === "restricted") {
    const { data: allowed } = await supabase
      .from("assignment_allowed_users")
      .select("user_id")
      .eq("assignment_id", assignmentId)
      .eq("user_id", user.id)
      .single();

    if (!allowed) {
      return { error: "You are not allowed to take this assignment" };
    }
  }

  if (assignment.creator_id === user.id) {
    return { error: "You cannot take your own assignment" };
  }

  const { data: existingAnyClaim } = await supabase
    .from("assignment_claims")
    .select("*")
    .eq("assignment_id", assignmentId)
    .eq("status", "accepted")
    .single();

  if (existingAnyClaim) {
    return { error: "This assignment has already been taken" };
  }

  const { data: existingUserClaim } = await supabase
    .from("assignment_claims")
    .select("*")
    .eq("assignment_id", assignmentId)
    .eq("user_id", user.id)
    .single();

  if (existingUserClaim) {
    return { error: "You have already taken this assignment" };
  }

  // Insert assignment claim
  const { error: claimError } = await supabase
    .from("assignment_claims")
    .insert({
      assignment_id: assignmentId,
      user_id: user.id,
      status: "accepted",
    });

  if (claimError) {
    return { error: `Failed to take assignment: ${claimError.message}` };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
