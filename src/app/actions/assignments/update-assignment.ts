"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getMaxDeadlineUTC } from "@/lib/timezone";

async function getUserIdByUsername(username: string) {
  const normalizedUsername = username.trim().toLowerCase();
  if (!normalizedUsername) return null;

  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", normalizedUsername)
    .maybeSingle();

  return data?.id ?? null;
}

export async function UpdateAssignment(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const deadline = formData.get("deadline") as string;
  const visibility = formData.get("visibility") as "public" | "restricted";
  const assignedUsername = formData.get("assignedUsername") as string | null;

  if (!id) {
    return { error: "Assignment ID is required" };
  }

  if (!title || title.length < 1) {
    return { error: "Title is required" };
  }

  if (!deadline) {
    return { error: "Deadline is required" };
  }

  // Validate ISO string
  if (!deadline.includes("Z")) {
    return { error: "Invalid deadline format" };
  }

  // Validate deadline
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const max = getMaxDeadlineUTC();

  if (!(deadlineDate > now && deadlineDate <= max)) {
    return { error: "Invalid deadline date" };
  }

  if (visibility === "restricted" && !assignedUsername) {
    return {
      error: "Please enter a user for this restricted assignment",
    };
  }

  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  // Validate restricted assignment
  let targetUserId: string | null = null;

  if (visibility === "restricted" && assignedUsername) {
    const username = assignedUsername.trim().toLowerCase();

    if (!username) {
      return { error: "Please enter a valid username" };
    }

    const userId = await getUserIdByUsername(username);

    if (!userId) {
      return { error: `No user found with username: ${username}` };
    }

    if (userId === user.id) {
      return { error: "You cannot assign an assignment to yourself" };
    }

    targetUserId = userId;
  }

  let currentActiveClaimUserId: string | null = null;

  if (visibility === "restricted") {
    const { data: activeClaim } = await supabase
      .from("assignment_claims")
      .select("user_id")
      .eq("assignment_id", id)
      .in("status", ["accepted", "in_progress", "finished"])
      .maybeSingle();

    currentActiveClaimUserId = activeClaim?.user_id ?? null;
  }

  // Update assignment
  const { data: assignment, error: assignmentError } = await supabase
    .from("assignments")
    .update({
      title,
      description,
      deadline,
      visibility,
    })
    .eq("id", id)
    .eq("creator_id", user.id)
    .select()
    .single();

  if (assignmentError) {
    return { error: `Failed to update assignment: ${assignmentError.message}` };
  }

  if (!assignment) {
    return {
      error: "Assignment not found or you don't have permission to update it",
    };
  }

  // Delete existing allowed users
  await supabase
    .from("assignment_allowed_users")
    .delete()
    .eq("assignment_id", assignment.id);

  // Add new allowed user if restricted
  if (visibility === "restricted" && targetUserId) {
    const { error: allowedUserError } = await supabase
      .from("assignment_allowed_users")
      .insert({
        assignment_id: assignment.id,
        user_id: targetUserId,
      });

    if (allowedUserError) {
      return { error: `Failed to assign user: ${allowedUserError.message}` };
    }
  }

  // Remove the old claimant's claim if a different user is assigned.
  if (
    visibility === "restricted" &&
    targetUserId &&
    currentActiveClaimUserId &&
    currentActiveClaimUserId !== targetUserId
  ) {
    const { error: claimsResetError } = await supabase
      .from("assignment_claims")
      .delete()
      .eq("assignment_id", assignment.id)
      .eq("user_id", currentActiveClaimUserId);

    if (claimsResetError) {
      return { error: `Failed to reset claims: ${claimsResetError.message}` };
    }
  }

  revalidatePath("/dashboard/assignments");
  revalidatePath(`/dashboard/assignments/${id}`);

  return { success: true, data: assignment };
}
