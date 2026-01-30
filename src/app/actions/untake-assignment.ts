"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function UntakeAssignment(formData: FormData) {
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

  // Delete the claim
  const { error: deleteError, data: deletedData } = await supabase
    .from("assignment_claims")
    .delete()
    .eq("assignment_id", assignmentId)
    .eq("user_id", user.id)
    .select();

  revalidatePath("/dashboard", "layout");
  return { success: true };
}
