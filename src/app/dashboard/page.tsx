import { Suspense } from "react";
import { Box, Text, Flex } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TimeBasedGreeting from "@/app/components/time-based-greeting";
import { CreateAssignmentDialog } from "@/app/components/assignments/create-assignment-dialog";
import {
  PlusIcon,
  FileTextIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import AssignmentAssignedList from "@/app/components/assignments/assignment-assigned-list";
import AssignmentAuthoredList from "@/app/components/assignments/assignment-authored-list";
import { AssignmentCardSkeleton } from "@/app/components/assignments/assignment-card-skeleton";
import { ChatListClient } from "@/app/components/messages/chat-list-client";
import { getUserChats } from "@/app/actions/messages/get-user-chats";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function AssignmentListSkeleton() {
  return (
    <Box>
      <AssignmentCardSkeleton />
      <AssignmentCardSkeleton />
    </Box>
  );
}

async function MessagesContent({
  userId,
  limit,
}: {
  userId: string;
  limit: number;
}) {
  const result = await getUserChats({ limit: limit });
  if (result.error) {
    return (
      <Box p="4">
        <Text color="red">{result.error}</Text>
      </Box>
    );
  }
  const chats = result.chats || [];
  return (
    <ChatListClient initialChats={chats} currentUserId={userId} limit={limit} />
  );
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const [
    { count: assignedCount },
    { count: authoredCount },
    { count: messagesCount },
  ] = await Promise.all([
    supabase
      .from("assignment_claims")
      .select("assignment_id, assignments:assignment_id(id)", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id)
      .not("assignments.id", "is", null),
    supabase
      .from("assignments")
      .select("id", { count: "exact", head: true })
      .eq("creator_id", user.id),
    supabase
      .from("dm_rooms")
      .select("id", { count: "exact", head: true })
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`),
  ]);

  return (
    <div className="p-4 min-w-xs">
      <Box className="mt-4 mb-10">
        <TimeBasedGreeting displayName={profile.display_name} />
      </Box>

      <Box
        className="bg-(--color-background) z-10 sticky py-4 top-0 -ml-16 pl-16 -mr-4 pr-4 "
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
        <Flex className="gap-2 overflow-scroll -mx-4 px-4">
          <CreateAssignmentDialog
            trigger={
              <Button variant="default" className="cursor-pointer">
                <PlusIcon /> Create Assignment
              </Button>
            }
          />
          <Button variant="secondary" asChild>
            <Link href="/dashboard/explore">
              <MagnifyingGlassIcon /> Explore
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/dashboard/assignments">
              <FileTextIcon /> My Assignments
            </Link>
          </Button>
        </Flex>
      </Box>

      <Box my="8">
        <Text className="text-xl font-bold">Assignments</Text>

        <Flex gap="4" className="mt-4 flex-col lg:flex-row lg:items-start">
          <Card className="flex-1 h-fit self-start w-full">
            <CardHeader>
              <CardTitle>Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<AssignmentListSkeleton />}>
                <AssignmentAssignedList limit={5} />
              </Suspense>
              {assignedCount ? (
                <Button variant="outline">
                  <Link href="/dashboard/assignments">View all</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>

          <Card className="flex-1 h-fit self-start w-full">
            <CardHeader>
              <CardTitle>Authored</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<AssignmentListSkeleton />}>
                <AssignmentAuthoredList limit={5} />
              </Suspense>
              {authoredCount ? (
                <Button variant="outline">
                  <Link href="/dashboard/assignments?tab=authored">
                    View all
                  </Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </Flex>
      </Box>

      <Box my="8">
        <Text className="text-xl font-bold">Messages</Text>

        <Box mt="4">
          <Card>
            <CardContent>
              <Suspense fallback={<AssignmentListSkeleton />}>
                <MessagesContent userId={user.id} limit={3} />
              </Suspense>
              {messagesCount ? (
                <Button variant="outline" className="mt-3">
                  <Link href="/dashboard/messages">View all</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </div>
  );
}
