"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import type { Message } from "@/types/message";

export async function getMessages(roomId: string): Promise<
  | { error: string }
  | {
      success: true;
      messages: Message[];
      receiver: { id: string; username: string; display_name: string; avatar_url: string | null };
    }
> {
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

  // Get messages for the room
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select(
      `
      id,
      body,
      sender_id,
      created_at
    `,
    )
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    return { error: messagesError.message };
  }

  // Get sender profiles
  let messagesWithSenders: Message[] = [];
  if (messages && messages.length > 0) {
    const senderIds = [...new Set(messages.map((m) => m.sender_id))];
    const { data: senders, error: sendersError } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .in("id", senderIds);

    if (sendersError) {
      return { error: sendersError.message };
    }

    // Merge sender data into messages
    messagesWithSenders = messages.map((message) => ({
      ...message,
      sender: senders!.find((s) => s.id === message.sender_id),
    })) as Message[];
  }

  // Verify user is a participant of this room
  const { data: room, error: roomError } = await supabase
    .from("dm_rooms")
    .select("user_a, user_b")
    .eq("id", roomId)
    .single();

  if (roomError) {
    return { error: "Room not found" };
  }

  if (room.user_a !== user.id && room.user_b !== user.id) {
    return { error: "Unauthorized" };
  }

  const receiverId = room.user_a === user.id ? room.user_b : room.user_a;

  // Get receiver profile
  const { data: receiver, error: receiverError } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .eq("id", receiverId)
    .single();

  if (receiverError) {
    return { error: "Receiver not found" };
  }

  return { success: true, messages: messagesWithSenders, receiver };
}
