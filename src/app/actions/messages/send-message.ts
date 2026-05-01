"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function sendMessage(roomId: string, body: string) {
  if (!body || body.trim() === "") {
    return { error: "Message cannot be empty" };
  }

  if (!roomId) {
    return { error: "Room ID is required" };
  }

  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  // Insert message
  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      room_id: roomId,
      sender_id: user.id,
      body: body.trim(),
    })
    .select("*")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/messages/${roomId}`);
  revalidatePath("/dashboard/messages");

  return { message };
}
