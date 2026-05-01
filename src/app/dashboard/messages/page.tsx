import { Box, Flex, Text } from "@radix-ui/themes";
import { getUserChats } from "@/app/actions/get-user-chats";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ChatListClient } from "@/app/components/chat-list-client";
import { StartNewChatDialog } from "@/app/components/start-new-chat-dialog";
import { redirect } from "next/navigation";



export default async function MessagesPage() {
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

  return (
    <Box p="4" className="min-w-sm">
      <Flex justify="between" className="mt-4 mb-10" gap="4">
        <h1 className="text-3xl font-bold">Messages</h1>
        <StartNewChatDialog />
      </Flex>
      <ChatListClient initialChats={chats} currentUserId={user.id} />
    </Box>
  );
}
