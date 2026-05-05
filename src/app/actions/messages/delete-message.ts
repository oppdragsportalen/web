"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function deleteMessage(messageId: string, roomId: string) {
  if (!messageId || !roomId) {
    return { error: "Message ID and Room ID are required" };
  }

  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId)
    .eq("sender_id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
