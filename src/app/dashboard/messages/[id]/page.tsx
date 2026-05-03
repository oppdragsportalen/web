import { Box, Text, Flex, IconButton, Button } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { getMessages } from "@/app/actions/messages/get-messages";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChatDetailClient } from "@/app/components/messages/chat-detail-client";

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

  if ("error" in result) {
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
    <Box className="flex-col min-h-full relative">
      <Box
        p="4"
        className="sticky top-0 left-0 w-full h-16 z-20"
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
        <Flex gap="2">
          <Link href="/dashboard/messages">
            <IconButton variant="soft">
              <ArrowLeftIcon />
            </IconButton>
          </Link>
          <Flex>
            <Flex align="center" gap="2">
              <Text weight="bold" size="3">
                {result.receiver.display_name}
              </Text>
              <Text size="2">{result.receiver.username}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      <Box className="-mt-16 min-h-full overflow-scroll absolute inset-0">
        <ChatDetailClient
          roomId={id}
          currentUserId={user.id}
          initialMessages={messages}
        />
      </Box>
    </Box>
  );
}
