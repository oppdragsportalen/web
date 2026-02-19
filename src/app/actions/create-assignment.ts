"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function CreateAssignment(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const deadline = formData.get("deadline") as string;
  const visibility = formData.get("visibility") as "public" | "restricted";
  const assignedEmail = formData.get("assignedEmail") as string | null;

  if (!title || title.length < 1) {
    return { error: "Title is required" };
  }

  if (!deadline) {
    return { error: "Deadline is required" };
  }

  // Validate deadline
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const max = new Date(now.setFullYear(now.getFullYear() + 1));

  if (!(deadlineDate > new Date() && deadlineDate <= max)) {
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

  // Create the assignment
  const { data: assignment, error: assignmentError } = await supabase
    .from("assignments")
    .insert({
      title,
      description,
      deadline,
      creator_id: user.id,
      visibility,
    })
    .select()
    .single();

  if (assignmentError) {
    return { error: assignmentError.message };
  }

  // Add user for restricted assignment
  if (visibility === "restricted" && assignment && assignedEmail) {
    const email = assignedEmail.trim().toLowerCase();

    if (!email) {
      await supabase.from("assignments").delete().eq("id", assignment.id);
      return { error: "Please enter a valid email" };
    }

    // Use database function to look up user ID by email
    const { data: userId, error: userError } = await supabase.rpc(
      "get_user_id_by_email",
      { email },
    );

    if (userError) {
      await supabase.from("assignments").delete().eq("id", assignment.id);
      return { error: `Failed to lookup user: ${userError.message}` };
    }

    if (!userId) {
      await supabase.from("assignments").delete().eq("id", assignment.id);
      return { error: `No user found with email: ${email}` };
    }

    // Prevent self-assignment
    if (userId === user.id) {
      await supabase.from("assignments").delete().eq("id", assignment.id);
      return { error: "You cannot assign an assignment to yourself" };
    }

    // Insert allowed user
    const { error: allowedUserError } = await supabase
      .from("assignment_allowed_users")
      .insert({
        assignment_id: assignment.id,
        user_id: userId,
      });

    if (allowedUserError) {
      await supabase.from("assignments").delete().eq("id", assignment.id);
      return { error: `Failed to assign user: ${allowedUserError.message}` };
    }
  }

  revalidatePath("/dashboard");
  return { success: true, assignment };
}
