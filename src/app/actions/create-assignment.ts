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

export async function CreateAssignment(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const deadline = formData.get("deadline") as string;
  const visibility = formData.get("visibility") as "public" | "restricted";
  const assignedUsername = formData.get("assignedUsername") as string;

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
  if (visibility === "restricted" && assignment && assignedUsername) {
    const username = assignedUsername.trim().toLowerCase();

    if (!username) {
      await supabase.from("assignments").delete().eq("id", assignment.id);
      return { error: "Please enter a valid username" };
    }

    const userId = await getUserIdByUsername(username);

    if (!userId) {
      await supabase.from("assignments").delete().eq("id", assignment.id);
      return { error: `No user found with username: @${username}` };
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
