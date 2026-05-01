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
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Refetch messages from database
  const refetchMessages = async (supabase: any) => {
    try {
      // Fetch messages without join
      const { data: allMessages } = await supabase
        .from("messages")
        .select("id, body, sender_id, created_at")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (!allMessages) return;

      // Get unique sender IDs
      const senderIds = [...new Set(allMessages.map((m: any) => m.sender_id))];

      // Fetch sender profiles
      let profiles: any[] = [];
      if (senderIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, username, display_name")
          .in("id", senderIds);
        profiles = profilesData || [];
      }

      // Merge profiles with messages
      const messagesWithSenders = allMessages.map((msg: any) => {
        const profile = profiles.find((p: any) => p.id === msg.sender_id);
        return {
          id: msg.id,
          body: msg.body,
          sender_id: msg.sender_id,
          created_at: msg.created_at,
          sender: profile || {
            id: msg.sender_id,
            username: "",
            display_name: null,
          },
        };
      });

      setMessages(messagesWithSenders);
    } catch (e) {
      console.error("Failed to refetch messages:", e);
    }
  };

  // Setup polling for new messages
  useEffect(() => {
    const supabase = createSupabaseClient();
    let isActive = true;

    // Refetch immediately on mount
    refetchMessages(supabase);

    // Then set up polling every 2 seconds
    pollingIntervalRef.current = setInterval(() => {
      if (isActive) {
        refetchMessages(supabase);
      }
    }, 2000);

    return () => {
      isActive = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
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

    // Refetch messages after a short delay to ensure server has processed
    setTimeout(() => {
      const supabase = createSupabaseClient();
      refetchMessages(supabase);
      setIsSending(false);
    }, 300);
  };

  const handleDeleteMessage = async (messageId: string) => {
    const result = await deleteMessage(messageId, roomId);
    if (result.error) {
      alert(result.error);
      return;
    }
    // Refetch messages after delete
    const supabase = createSupabaseClient();
    refetchMessages(supabase);
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
