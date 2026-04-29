"use client";

import { Box, Text, Card } from "@radix-ui/themes";
import Link from "next/link";
import { formatTimeAgo } from "@/lib/date-utils";

type ChatItemProps = {
  id: string;
  recipient: {
    id: string;
    username: string;
    display_name: string | null;
  } | null;
  lastMessage: {
    id: string;
    body: string;
    sender_id: string;
    created_at: string;
  } | null;
  createdAt: string;
  currentUserId: string;
};

export function ChatItem({
  id,
  recipient,
  lastMessage,
  createdAt,
  currentUserId,
}: ChatItemProps) {
  if (!recipient) return null;

  const displayName = recipient.display_name || recipient.username;
  const lastMessageTime = lastMessage
    ? formatTimeAgo(lastMessage.created_at)
    : formatTimeAgo(createdAt);

  const lastMessagePreview = lastMessage
    ? `${lastMessage.sender_id === currentUserId ? "You: " : ""}${lastMessage.body.substring(0, 50)}${lastMessage.body.length > 50 ? "..." : ""}`
    : "No messages yet";

  return (
    <Link href={`/dashboard/messages/${id}`}>
      <Card style={{ cursor: "pointer", marginBottom: "8px" }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Text weight="bold" size="3">
              {displayName}
            </Text>
            <Text color="gray" size="2">
              @{recipient.username}
            </Text>
          </Box>
          <Text color="gray" size="1">
            {lastMessageTime}
          </Text>
        </Box>
        <Text color="gray" size="2" style={{ marginTop: "8px" }}>
          {lastMessagePreview}
        </Text>
      </Card>
    </Link>
  );
}
