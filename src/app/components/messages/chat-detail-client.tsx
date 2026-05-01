"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Text, TextField, Button } from "@radix-ui/themes";
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
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "messages",
            filter: `room_id=eq.${roomId}`,
          },
          (payload) => {
            if (!isActive) return;

            const deletedId = payload.old.id;
            setMessages((prev) => prev.filter((msg) => msg.id !== deletedId));
          }
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
            const sender = await fetchSenderProfile(supabase, updatedMsg.sender_id);

            const messageWithSender: Message = {
              id: updatedMsg.id,
              body: updatedMsg.body,
              sender_id: updatedMsg.sender_id,
              created_at: updatedMsg.created_at,
              sender,
            };

            setMessages((prev) =>
              prev.map((msg) => (msg.id === updatedMsg.id ? messageWithSender : msg))
            );
          }
        )
        .subscribe();

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
    const result = await deleteMessage(messageId, roomId);
    if (result.error) {
      alert(result.error);
      return;
    }
  };

  return (
    <Box
      p="4"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 180px)",
      }}
    >
      {/* Messages Container */}
      <Box
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "16px",
          paddingRight: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {messages.length === 0 ? (
          <Box style={{ textAlign: "center", padding: "32px" }}>
            <Text color="gray">No messages yet</Text>
            <Text color="gray" size="2" style={{ marginTop: "8px" }}>
              Start the conversation
            </Text>
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
                <Box
                  style={{
                    maxWidth: "70%",
                    backgroundColor: isOwn ? "#0ea5e9" : "#e5e7eb",
                    color: isOwn ? "white" : "black",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    wordBreak: "break-word",
                    position: "relative",
                  }}
                >
                  <Text size="2">{message.body}</Text>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "4px",
                      gap: "8px",
                    }}
                  >
                    <Text size="1" color={isOwn ? "gray" : "gray"} suppressHydrationWarning>
                      {formatTimeAgo(message.created_at)}
                    </Text>
                    {isOwn && (
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px",
                          color: "inherit",
                          opacity: 0.6,
                        }}
                        title="Delete message"
                      >
                        <TrashIcon width="14" height="14" />
                      </button>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        style={{
          display: "flex",
          gap: "8px",
          borderTop: "1px solid #e5e7eb",
          paddingTop: "16px",
        }}
      >
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
    </Box>
  );
}
