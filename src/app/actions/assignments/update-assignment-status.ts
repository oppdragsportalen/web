"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { ClaimStatus } from "@/types";

export async function UpdateAssignmentStatus(formData: FormData) {
  const assignmentId = formData.get("assignmentId") as string;
  const newStatus = formData.get("status") as ClaimStatus;

  if (!assignmentId) {
    return { error: "Assignment ID is required" };
  }

  if (
    !newStatus ||
    !["accepted", "in_progress", "finished"].includes(newStatus)
  ) {
    return { error: "Valid status is required" };
  }

  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  // Check if user has claimed this assignment
  const { data: existingClaim, error: checkError } = await supabase
    .from("assignment_claims")
    .select("*")
    .eq("assignment_id", assignmentId)
    .eq("user_id", user.id)
    .single();

  if (checkError || !existingClaim) {
    return { error: "You have not claimed this assignment" };
  }

  // Update the status
  const { error: updateError } = await supabase
    .from("assignment_claims")
    .update({ status: newStatus })
    .eq("assignment_id", assignmentId)
    .eq("user_id", user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/assignments/${assignmentId}`);
  return { success: true };
}
