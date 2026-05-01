import { Box, Text, Button } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { getMessages } from "@/app/actions/messages/get-messages";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChatDetailClient } from "@/app/components/messages/chat-detail-client";
import type { Message } from "@/types";

type ChatDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ChatDetailPage({ params }: ChatDetailPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const result = await getMessages(id);

  if (result.error) {
    return (
      <Box p="4">
        <Link href="/dashboard/messages">
          <Button variant="soft" className="mb-10">
            <ArrowLeftIcon /> Back to Messages
          </Button>
        </Link>
        <Text color="red">{result.error}</Text>
      </Box>
    );
  }

  const messages = result.messages || [];

  return (
    <>
      <Link href="/dashboard/messages" className="mb-10">
        <Button variant="soft">
          <ArrowLeftIcon />
        </Button>
      </Link>
      <ChatDetailClient
        roomId={id}
        currentUserId={user.id}
        initialMessages={messages}
      />
    </>
  );
}
