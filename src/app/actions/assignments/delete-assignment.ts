"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function DeleteAssignment(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createSupabaseServer();
  await supabase.from("assignments").delete().eq("id", id);
  revalidatePath("/dashboard/assignments");
}
