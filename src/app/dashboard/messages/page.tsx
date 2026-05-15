import { Box, Flex, Text } from "@radix-ui/themes";
import { getUserChats } from "@/app/actions/messages/get-user-chats";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ChatListClient } from "@/app/components/messages/chat-list-client";
import { StartNewChatDialog } from "@/app/components/messages/start-new-chat-dialog";
import { redirect } from "next/navigation";
import { AssignmentCardSkeleton } from "@/app/components/assignments/assignment-card-skeleton";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";

async function MessagesContent() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const result = await getUserChats();

  if (result.error) {
    return (
      <Box p="4">
        <Text color="red">{result.error}</Text>
      </Box>
    );
  }

  const chats = result.chats || [];

  return <ChatListClient initialChats={chats} currentUserId={user.id} />;
}

export default async function MessagesPage() {
  return (
    <Box p="4" className="min-w-sm">
      <Box
        className="bg-(--color-background) z-10 sticky py-4 top-0 -ml-16 pl-16 -mr-4 pr-4"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
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
        <Flex justify="between" className="mb-10" gap="4">
          <h1 className="text-3xl font-bold">Messages</h1>
          <StartNewChatDialog
            trigger={
              <Button>
                <SquarePen />
                New Message
              </Button>
            }
          />
        </Flex>
      </Box>
      <Suspense
        fallback={
          <>
            <AssignmentCardSkeleton />
            <AssignmentCardSkeleton />
            <AssignmentCardSkeleton />
            <AssignmentCardSkeleton />
          </>
        }
      >
        <MessagesContent />
      </Suspense>
    </Box>
  );
}
