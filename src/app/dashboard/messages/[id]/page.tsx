import { Box, Text, Flex, Separator } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { getMessages } from "@/app/actions/messages/get-messages";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChatDetailClient } from "@/app/components/messages/chat-detail-client";
import ChatDetailSkeleton from "@/app/components/messages/chat-detail-skeleton";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type ChatDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function ChatDetailContent({ roomID }: { roomID: string }) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const result = await getMessages(roomID);

  if ("error" in result) {
    redirect("/dashboard/messages");
  }

  const messages = result.messages || [];

  return (
    <>
      <Box
        className="sticky top-0 left-0 w-full h-16 z-20 p-4 pl-20"
        style={{
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          background: `
                    linear-gradient(
                      to bottom,
                      rgba(var(--color-background-rgb), 0.95) 0%,
                      rgba(var(--color-background-rgb), 0) 100%
                    )
                  `,
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
        }}
      >
        <Flex gap="2" align="center">
          <Button size="icon" className="cursor-pointer" asChild>
            <Link href="/dashboard/messages">
              <ArrowLeftIcon />
            </Link>
          </Button>
          <Separator orientation="vertical" size="1" mx="2" />
          <Flex>
            <Flex align="center" gap="2">
              <Avatar>
                <AvatarImage
                  src={result.receiver.avatar_url || undefined}
                  alt={result.receiver.username}
                />
                <AvatarFallback>
                  {result.receiver.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Text weight="bold" size="3">
                {result.receiver.display_name}
              </Text>
              <Text size="2">{result.receiver.username}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      <Box className="-mt-16 pl-16 overflow-scroll absolute inset-0">
        <ChatDetailClient
          roomId={roomID}
          currentUserId={user.id}
          initialMessages={messages}
        />
      </Box>
    </>
  );
}

export default async function ChatDetailPage({ params }: ChatDetailPageProps) {
  const { id } = await params;

  return (
    <Box className="flex-col min-h-full relative -ml-16">
      <Suspense
        fallback={
          <Box className="pl-16">
            <ChatDetailSkeleton />
          </Box>
        }
      >
        <ChatDetailContent roomID={id} />
      </Suspense>
    </Box>
  );
}
