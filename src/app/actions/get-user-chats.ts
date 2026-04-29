"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function getUserChats() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  // Get all DM rooms where user is a participant (either user_a or user_b)
  const { data: rooms, error: roomsError } = await supabase
    .from("dm_rooms")
    .select(
      `
      id,
      user_a,
      user_b,
      created_at,
      messages (
        id,
        body,
        sender_id,
        created_at
      )
    `
    )
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (roomsError) {
    return { error: roomsError.message };
  }

  // Get other user IDs and fetch their profiles
  const otherUserIds = rooms.map((room) =>
    room.user_a === user.id ? room.user_b : room.user_a
  );

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .in("id", otherUserIds);

  if (profilesError) {
    return { error: profilesError.message };
  }

  // Merge profiles with rooms and pick newest message in each room.
  const chats = rooms.map((room) => {
    const recipientId = room.user_a === user.id ? room.user_b : room.user_a;
    const recipient = profiles.find((p) => p.id === recipientId);
    const lastMessage =
      room.messages?.reduce((latest, message) => {
        if (!latest) return message;
        return new Date(message.created_at) > new Date(latest.created_at)
          ? message
          : latest;
      }, null as (typeof room.messages)[number] | null) ?? null;

    return {
      id: room.id,
      recipient: recipient,
      lastMessage: lastMessage,
      createdAt: room.created_at,
    };
  });

  chats.sort((a, b) => {
    const aTime = new Date(a.lastMessage?.created_at ?? a.createdAt).getTime();
    const bTime = new Date(b.lastMessage?.created_at ?? b.createdAt).getTime();
    return bTime - aTime;
  });

  return { chats };
}
