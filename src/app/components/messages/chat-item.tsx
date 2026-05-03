"use client";

import { Box, Text, Card, Tooltip, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { formatTimeAgo } from "@/lib/date-utils";
import type { Profile } from "@/types";

type ChatItemProps = {
  id: string;
  recipient: Profile | null;
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
      <Card className="mb-3 p-3 cursor-pointer hover:outline outline-(--accent-8) -outline-offset-1">
        <Flex justify="between" align="center" className="mb-2">
          <Text weight="bold" size="3">
            {displayName}
          </Text>
          <Flex gap="2">
            <Text color="gray" size="1">
              {lastMessageTime}
            </Text>
          </Flex>
        </Flex>
        <Flex justify="between">
          <Box>
            <Text size="2" color="gray">
              {lastMessagePreview}
            </Text>
          </Box>

          <Box>
            <Tooltip
              content={
                <span>
                  <strong>{recipient.username}</strong> {displayName}
                </span>
              }
            >
              <Text size="2" color="gray">
                {recipient.username}
              </Text>
            </Tooltip>
          </Box>
        </Flex>
      </Card>
    </Link>
  );
}
