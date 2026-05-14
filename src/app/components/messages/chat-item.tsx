"use client";

import { Box, Text, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { formatTimeAgo } from "@/lib/date-utils";
import type { Profile } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      <Card
        size="sm"
        className="cursor-pointer hover:outline outline-(--accent-8)"
      >
        <CardHeader>
          <Flex justify="between" align="center">
            <CardTitle>
              <Flex align="center" gap="2">
                <Avatar>
                  <AvatarImage
                    src={recipient.avatar_url || undefined}
                    alt={displayName}
                  />
                  <AvatarFallback>
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Text weight="bold" size="3">
                  {displayName}
                </Text>
              </Flex>
            </CardTitle>
            <Box>
              <Text color="gray" size="1">
                {lastMessageTime}
              </Text>
            </Box>
          </Flex>
        </CardHeader>
        <CardContent>
          <Flex justify="between">
            <Box>
              <Text size="2" color="gray">
                {lastMessagePreview}
              </Text>
            </Box>
            <Box>
              <TooltipProvider>
                <Tooltip>
                  <TooltipContent>
                    <span>
                      <strong>{recipient.username}</strong> {displayName}
                    </span>
                  </TooltipContent>
                  <TooltipTrigger>
                    <Text size="2" color="gray">
                      {recipient.username}
                    </Text>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </Box>
          </Flex>
        </CardContent>
      </Card>
    </Link>
  );
}
