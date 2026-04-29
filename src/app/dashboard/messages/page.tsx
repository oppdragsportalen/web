import { Box, Flex, Text } from "@radix-ui/themes";
import { getUserChats } from "@/app/actions/get-user-chats";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ChatItem } from "@/app/components/chat-item";
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
    <Box p="4">
      <Flex justify="between" className="mt-4 mb-10">
        <h1 className="text-3xl font-bold">Messages</h1>
        <StartNewChatDialog />
      </Flex>

      {chats.length === 0 ? (
        <Text color="gray">Start a new chat to begin messaging</Text>
      ) : (
        <Box>
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              id={chat.id}
              recipient={chat.recipient}
              lastMessage={chat.lastMessage}
              createdAt={chat.createdAt}
              currentUserId={user.id}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
