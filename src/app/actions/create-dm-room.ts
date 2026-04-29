"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function createDMRoom(recipientUsername: string) {
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

  const { data: recipientProfile, error: recipientError } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", normalizedUsername)
    .maybeSingle();

  if (recipientError) {
    return { error: recipientError.message };
  }

  if (!recipientProfile) {
    return { error: "User not found" };
  }

  const recipientId = recipientProfile.id;

  if (recipientId === currentUser.id) {
    return { error: "Cannot message yourself" };
  }

  const { data: newRoom, error: createError } = await supabase
    .from("dm_rooms")
    .insert({
      user_a: currentUser.id,
      user_b: recipientId,
    })
    .select("id")
    .single();

  if (!createError) {
    return { roomId: newRoom.id };
  }

  // If a room was created concurrently, fetch and return it.
  if (createError.code === "23505") {
    const { data: existingRoom1, error: existingRoomError1 } = await supabase
      .from("dm_rooms")
      .select("id")
      .eq("user_a", currentUser.id)
      .eq("user_b", recipientId)
      .maybeSingle();

    if (existingRoomError1) {
      return { error: existingRoomError1.message };
    }

    if (existingRoom1) {
      return { roomId: existingRoom1.id };
    }

    const { data: existingRoom2, error: existingRoomError2 } = await supabase
      .from("dm_rooms")
      .select("id")
      .eq("user_a", recipientId)
      .eq("user_b", currentUser.id)
      .maybeSingle();

    if (existingRoomError2) {
      return { error: existingRoomError2.message };
    }

    if (existingRoom2) {
      return { roomId: existingRoom2.id };
    }
  }

  return { error: createError.message };
}