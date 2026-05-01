"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function getDMRoom(recipientUsername: string) {
  const normalizedUsername = recipientUsername.trim().toLowerCase();

  if (!normalizedUsername) {
    return { error: "Username is required" };
  }

  const supabase = await createSupabaseServer();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    return { error: "Not logged in" };
  }

  const { data: recipientId, error: recipientError } = await supabase.rpc(
    "get_user_id_by_username",
    { input_username: normalizedUsername }
  );

  if (recipientError || !recipientId) {
    return { error: "User not found" };
  }

  if (recipientId === currentUser.id) {
    return { error: "Cannot message yourself" };
  }

  const { data: room1, error: error1 } = await supabase
    .from("dm_rooms")
    .select("id")
    .eq("user_a", currentUser.id)
    .eq("user_b", recipientId)
    .maybeSingle();

  if (error1) {
    return { error: error1.message };
  }

  if (room1) {
    return { roomId: room1.id };
  }

  const { data: room2, error: error2 } = await supabase
    .from("dm_rooms")
    .select("id")
    .eq("user_a", recipientId)
    .eq("user_b", currentUser.id)
    .maybeSingle();

  if (error2) {
    return { error: error2.message };
  }

  return { roomId: room2?.id ?? null };
}