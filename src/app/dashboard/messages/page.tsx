import { Box, Flex, Text, Button } from "@radix-ui/themes";
import { getUserChats } from "@/app/actions/messages/get-user-chats";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ChatListClient } from "@/app/components/messages/chat-list-client";
import { StartNewChatDialog } from "@/app/components/messages/start-new-chat-dialog";
import { redirect } from "next/navigation";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { AssignmentCardSkeleton } from "@/app/components/assignments/assignment-card-skeleton";
import { Suspense } from "react";

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
      <Flex justify="between" className="mt-4 mb-10" gap="4">
        <h1 className="text-3xl font-bold">Messages</h1>
        <StartNewChatDialog
          trigger={
            <Button>
              <Pencil2Icon />
              New Message
            </Button>
          }
        />
      </Flex>
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
