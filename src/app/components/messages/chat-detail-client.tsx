"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Text,
  TextField,
  Card,
  Button,
  Flex,
  ContextMenu,
} from "@radix-ui/themes";
import { TrashIcon } from "@radix-ui/react-icons";
import { sendMessage } from "@/app/actions/messages/send-message";
import { deleteMessage } from "@/app/actions/messages/delete-message";
import { formatTimeAgo } from "@/lib/date-utils";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { Message } from "@/types";

type ChatDetailClientProps = {
  roomId: string;
  currentUserId: string;
  initialMessages: Message[];
};

export function ChatDetailClient({
  roomId,
  currentUserId,
  initialMessages,
}: ChatDetailClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<any>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch sender profile for a message
  const fetchSenderProfile = async (supabase: any, senderId: string) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, username, display_name")
        .eq("id", senderId)
        .single();

      return (
        profile || {
          id: senderId,
          username: "",
          display_name: null,
        }
      );
    } catch (e) {
      console.error("Failed to fetch sender profile:", e);
      return {
        id: senderId,
        username: "",
        display_name: null,
      };
    }
  };

  // Setup Supabase Realtime subscriptions
  useEffect(() => {
    const supabase = createSupabaseClient();
    let isActive = true;

    const setupSubscriptions = async () => {
      // Subscribe to changes in the messages table for this room
      const channel = supabase
        .channel(`messages:${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `room_id=eq.${roomId}`,
          },
          async (payload) => {
            if (!isActive) return;

            const newMsg = payload.new;
            const sender = await fetchSenderProfile(supabase, newMsg.sender_id);

            const messageWithSender: Message = {
              id: newMsg.id,
              body: newMsg.body,
              sender_id: newMsg.sender_id,
              created_at: newMsg.created_at,
              sender,
            };

            setMessages((prev) => [...prev, messageWithSender]);
          },
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            if (!isActive) return;

            const deletedId = payload.old.id;
            setMessages((prev) => prev.filter((msg) => msg.id !== deletedId));
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
            filter: `room_id=eq.${roomId}`,
          },
          async (payload) => {
            if (!isActive) return;

            const updatedMsg = payload.new;
            const sender = await fetchSenderProfile(
              supabase,
              updatedMsg.sender_id,
            );

            const messageWithSender: Message = {
              id: updatedMsg.id,
              body: updatedMsg.body,
              sender_id: updatedMsg.sender_id,
              created_at: updatedMsg.created_at,
              sender,
            };

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMsg.id ? messageWithSender : msg,
              ),
            );
          },
        )
        .subscribe((status, err) => {
          if (status === "SUBSCRIBED") {
            console.log(`Subscribed to room ${roomId}`);
          } else if (status === "CHANNEL_ERROR") {
            console.error(`Channel error for room ${roomId}:`, err);
          } else if (status === "TIMED_OUT") {
            console.warn(`Subscription timed out for room ${roomId}`);
            // Retry subscription
            if (isActive) {
              setupSubscriptions();
            }
          }
        });

      subscriptionRef.current = channel;
    };

    setupSubscriptions();

    return () => {
      isActive = false;
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [roomId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    const messageText = newMessage;

    const result = await sendMessage(roomId, messageText);
    setNewMessage("");

    if (result.error) {
      alert(result.error);
      setIsSending(false);
      return;
    }

    setIsSending(false);
  };

  const handleDeleteMessage = async (messageId: string) => {
    const messageToDelete = messages.find((msg) => msg.id === messageId);

    // Optimistic update - remove message immediately from UI
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

    const result = await deleteMessage(messageId, roomId);
    if (result.error) {
      // Restore message if deletion fails
      if (messageToDelete) {
        setMessages((prev) => [...prev, messageToDelete]);
      }
      alert(result.error);
      return;
    }
  };

  return (
    <Box pt="0" p="4" className="h-full min-w-sm">
      <Flex
        direction="column"
        justify="end"
        className="flex flex-1 mb-10 pt-44 min-h-full"
      >
        {messages.length === 0 ? (
          <Box className="text-center py-56">
            <Text color="gray">No messages yet</Text>
          </Box>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === currentUserId;
            return (
              <Box
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent: isOwn ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                <ContextMenu.Root>
                  <ContextMenu.Trigger>
                    <Card
                      variant="ghost"
                      m="3"
                      className={`max-w-9/12 wrap-break-words ${
                        isOwn
                          ? "bg-blue-500 text-white dark:bg-blue-600"
                          : "bg-neutral-200 dark:bg-neutral-800 dark:text-white"
                      }`}
                    >
                      <Text size="2">{message.body}</Text>

                      <Flex justify="end" align="end">
                        <Text size="1" suppressHydrationWarning>
                          {formatTimeAgo(message.created_at)}
                        </Text>
                      </Flex>
                    </Card>
                  </ContextMenu.Trigger>

                  {isOwn && (
                    <ContextMenu.Content>
                      <ContextMenu.Item
                        color="red"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        <TrashIcon />
                        Delete Message
                      </ContextMenu.Item>
                    </ContextMenu.Content>
                  )}
                </ContextMenu.Root>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Flex>

      <Flex
        align="end"
        className="sticky bottom-0 h-16 p-4 -mx-4"
        style={{
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          background: `
          linear-gradient(
            to top,
            rgba(var(--color-background-rgb), 0.95) 0%,
            rgba(var(--color-background-rgb), 0) 100%
          )
        `,
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
        }}
      >
        <form className="flex flex-1 gap-3" onSubmit={handleSendMessage}>
          <TextField.Root
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
            style={{ flex: 1 }}
          />
          <Button type="submit" disabled={isSending || !newMessage.trim()}>
            Send
          </Button>
        </form>
      </Flex>
    </Box>
  );
}
