"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getMaxDeadlineUTC } from "@/lib/timezone";

export async function UpdateAssignment(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const deadline = formData.get("deadline") as string;
  const visibility = formData.get("visibility") as "public" | "restricted";
  const assignedEmail = formData.get("assignedEmail") as string | null;

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

  if (visibility === "restricted" && !assignedEmail) {
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

  // Delete allowed user for public assignment
  if (visibility === "public") {
    await supabase
      .from("assignment_allowed_users")
      .delete()
      .eq("assignment_id", assignment.id);
  }

  // Update allowed users for restricted assignment
  if (visibility === "restricted" && assignment && assignedEmail) {
    const email = assignedEmail.trim().toLowerCase();

    if (!email) {
      return { error: "Please enter a valid email" };
    }

    await supabase
      .from("assignment_allowed_users")
      .delete()
      .eq("assignment_id", assignment.id);

    const { data: userId, error: userError } = await supabase.rpc(
      "get_user_id_by_email",
      { email },
    );

    if (userError) {
      return { error: `Failed to lookup user: ${userError.message}` };
    }

    if (!userId) {
      return { error: `No user found with email: ${email}` };
    }

    if (userId === user.id) {
      return { error: "You cannot assign an assignment to yourself" };
    }

    const { error: allowedUserError } = await supabase
      .from("assignment_allowed_users")
      .insert({
        assignment_id: assignment.id,
        user_id: userId,
      });

    if (allowedUserError) {
      return { error: `Failed to assign user: ${allowedUserError.message}` };
    }
  }

  revalidatePath("/dashboard/assignments");
  revalidatePath(`/dashboard/assignments/${id}`);

  return { success: true, data: assignment };
}
