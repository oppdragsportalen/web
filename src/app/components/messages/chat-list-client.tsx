"use client";

import { useEffect, useState } from "react";
import { Box, Flex, Text } from "@radix-ui/themes";
import { ChatItem } from "@/app/components/messages/chat-item";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { Message, Profile } from "@/types";

type Chat = {
  id: string;
  recipient: Profile | null;
  lastMessage: Omit<Message, "sender"> | null;
  createdAt: string;
};

type ChatListClientProps = {
  initialChats: Chat[];
  currentUserId: string;
};

export function ChatListClient({
  initialChats,
  currentUserId,
}: ChatListClientProps) {
  const [chats, setChats] = useState<Chat[]>(initialChats);

  // Fetch latest chats from database
  const refetchChats = async (supabase: any) => {
    try {
      // Fetch rooms without join
      const { data: rooms } = await supabase
        .from("dm_rooms")
        .select("id, user_a, user_b, created_at")
        .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`)
        .order("created_at", { ascending: false });

      if (!rooms) return;

      // Fetch all messages for these rooms
      const roomIds = rooms.map((r: any) => r.id);
      const { data: allMessages } = await supabase
        .from("messages")
        .select("id, room_id, body, sender_id, created_at")
        .in("room_id", roomIds);

      if (!allMessages) return;

      // Get the latest message for each room
      const lastMessagesByRoom: Record<string, any> = {};
      allMessages.forEach((msg: any) => {
        if (
          !lastMessagesByRoom[msg.room_id] ||
          new Date(msg.created_at) >
            new Date(lastMessagesByRoom[msg.room_id].created_at)
        ) {
          lastMessagesByRoom[msg.room_id] = msg;
        }
      });

      // Get unique other user IDs
      const otherUserIds = rooms.map((room: any) =>
        room.user_a === currentUserId ? room.user_b : room.user_a,
      );

      // Fetch profiles for other users
      let profiles: any[] = [];
      if (otherUserIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, username, display_name")
          .in("id", otherUserIds);
        profiles = profilesData || [];
      }

      // Build chat list
      const updatedChats = rooms.map((room: any) => {
        const recipient = profiles.find(
          (p: any) =>
            p.id ===
            (room.user_a === currentUserId ? room.user_b : room.user_a),
        );
        const lastMessage = lastMessagesByRoom[room.id];

        return {
          id: room.id,
          recipient: recipient
            ? {
                id: recipient.id,
                username: recipient.username,
                display_name: recipient.display_name,
              }
            : null,
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                body: lastMessage.body,
                sender_id: lastMessage.sender_id,
                created_at: lastMessage.created_at,
              }
            : null,
          createdAt: room.created_at,
        };
      });

      setChats(updatedChats);
    } catch (err) {
      console.error("Failed to refetch chats:", err);
    }
  };

  // Supabase Realtime subscriptions
  useEffect(() => {
    const supabase = createSupabaseClient();
    let isActive = true;
    let currentRoomIds: string[] = [];
    let roomsChannel: any = null;
    let messagesChannel: any = null;

    const runRefetch = async () => {
      if (!isActive) return;
      const { data: rooms } = await supabase
        .from("dm_rooms")
        .select("id")
        .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`)
        .order("created_at", { ascending: false });

      if (rooms) {
        currentRoomIds = rooms.map((r) => r.id);
      }
      await refetchChats(supabase);
    };

    const handleNewRoom = async (payload: any) => {
      const room = payload.new;
      if (room.user_a !== currentUserId && room.user_b !== currentUserId)
        return;

      // Add the new room ID to tracking
      if (!currentRoomIds.includes(room.id)) {
        currentRoomIds.push(room.id);
      }

      // Fetch the new room's data and add it to UI
      await refetchChats(supabase);
    };

    const setupSubscriptions = () => {
      roomsChannel = supabase.channel(`dm-rooms:${currentUserId}`);
      roomsChannel.on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dm_rooms" },
        handleNewRoom,
      );
      roomsChannel.subscribe();

      messagesChannel = supabase.channel(`dm-messages:${currentUserId}`);
      messagesChannel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        async (payload: any) => {
          const msgRoomId = payload.new?.room_id || payload.old?.room_id;
          if (msgRoomId && currentRoomIds.includes(msgRoomId)) {
            await refetchChats(supabase);
          }
        },
      );
      messagesChannel.subscribe();
    };

    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await runRefetch();
          setupSubscriptions();
        } else {
          const { data } = supabase.auth.onAuthStateChange(
            (_event, session) => {
              if (session?.user) {
                runRefetch().then(() => {
                  setupSubscriptions();
                });
                if (data?.subscription) data.subscription.unsubscribe();
              }
            },
          );
        }
      } catch (e) {
        console.error("Authentication failed", e);
        await runRefetch();
        setupSubscriptions();
      }
    })();

    return () => {
      isActive = false;
      roomsChannel?.unsubscribe();
      messagesChannel?.unsubscribe();
    };
  }, [currentUserId]);

  return (
    <Box>
      {chats.length === 0 ? (
        <Flex direction="column" align="center" className="mt-30">
          <Text size="6" weight="bold" align="center">
            No Messages
          </Text>
          <Text color="gray" align="center">
            Send a message to start a conversation
          </Text>
        </Flex>
      ) : (
        <Box>
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              id={chat.id}
              recipient={chat.recipient}
              lastMessage={chat.lastMessage}
              createdAt={chat.createdAt}
              currentUserId={currentUserId}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
