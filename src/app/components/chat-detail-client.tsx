"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Text, TextField, Button, Spinner } from "@radix-ui/themes";
import { TrashIcon } from "@radix-ui/react-icons";
import { sendMessage } from "@/app/actions/send-message";
import { deleteMessage } from "@/app/actions/delete-message";
import { formatTimeAgo } from "@/lib/date-utils";
import { createSupabaseClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  body: string;
  sender_id: string;
  created_at: string;
  sender: {
    id: string;
    username: string;
    display_name: string | null;
  };
};

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
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    const supabase = createSupabaseClient();
    let isActive = true;

    const setupRealtime = async () => {
      // Ensure auth state is loaded before subscribing to RLS-protected changes.
      await supabase.auth.getSession();

      const channel = supabase
        .channel(`messages-${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `room_id=eq.${roomId}`,
          },
          async (payload: any) => {
            if (!isActive) return;

            const inserted = payload.new;

            const { data: senderProfile } = await supabase
              .from("profiles")
              .select("id, username, display_name")
              .eq("id", inserted.sender_id)
              .maybeSingle();

            setMessages((prev) => {
              if (prev.some((m) => m.id === inserted.id)) {
                return prev;
              }

              return [
                ...prev,
                {
                  id: inserted.id,
                  body: inserted.body,
                  sender_id: inserted.sender_id,
                  created_at: inserted.created_at,
                  sender: {
                    id: inserted.sender_id,
                    username: senderProfile?.username ?? "",
                    display_name: senderProfile?.display_name ?? null,
                  },
                },
              ];
            });
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
          (payload: any) => {
            if (!isActive) return;
            const deletedId = payload.old.id;
            setMessages((prev) => prev.filter((m) => m.id !== deletedId));
          }
        );

      channel.subscribe((status) => {
        if (!isActive) return;

        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setError(
            "Realtime connection failed. Check Supabase Realtime replication for messages table."
          );
        }
      });

      return channel;
    };

    let activeChannel: ReturnType<typeof supabase.channel> | null = null;
    setupRealtime().then((channel) => {
      if (!isActive) {
        if (channel) {
          supabase.removeChannel(channel);
        }
        return;
      }
      activeChannel = channel ?? null;
    });

    return () => {
      isActive = false;
      if (activeChannel) {
        supabase.removeChannel(activeChannel);
      }
    };
  }, [roomId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setIsSending(true);
    const result = await sendMessage(roomId, newMessage);

    if (result.error) {
      setError(result.error);
      setIsSending(false);
      return;
    }

    // Clear message. Realtime subscription will append it.
    setNewMessage("");
    setError("");
    setIsSending(false);
  };

  const handleDeleteMessage = async (messageId: string) => {
    const result = await deleteMessage(messageId, roomId);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessages((prev) => prev.filter((m) => m.id !== messageId));
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
                  className="group"
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
                    <Text size="1" color={isOwn ? "gray" : "gray"}>
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
          {isSending ? <Spinner /> : "Send"}
        </Button>
      </form>

      {error && (
        <Text color="red" size="2" style={{ marginTop: "8px" }}>
          {error}
        </Text>
      )}
    </Box>
  );
}
