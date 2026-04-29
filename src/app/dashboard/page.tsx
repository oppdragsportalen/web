import { Suspense } from "react";
import { Box, Card, Text, Button, Flex } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TimeBasedGreeting from "@/app/components/time-based-greeting";
import { CreateAssignmentDialog } from "@/app/components/create-assignment-dialog";
import {
  PlusIcon,
  FileTextIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import AssignmentAssignedList from "@/app/components/assignment-assigned-list";
import AssignmentAuthoredList from "@/app/components/assignment-authored-list";
import { AssignmentCardSkeleton } from "@/app/components/assignment-card-skeleton";

function AssignmentListSkeleton() {
  return (
    <Box>
      <AssignmentCardSkeleton />
      <AssignmentCardSkeleton />
    </Box>
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

  const [{ count: assignedCount }, { count: authoredCount }] = await Promise.all([
    supabase
      .from("assignment_claims")
      .select("assignment_id, assignments:assignment_id(id)", { count: "exact", head: true })
      .eq("user_id", user.id)
      .not("assignments.id", "is", null),
    supabase
      .from("assignments")
      .select("id", { count: "exact", head: true })
      .eq("creator_id", user.id),
  ]);

  return (
    <div className="p-4 min-w-137.5">
      <Box className="mt-4 mb-10">
        <TimeBasedGreeting displayName={profile.display_name} />
      </Box>
      <Flex className="gap-2">
        <CreateAssignmentDialog
          trigger={
            <Button variant="solid">
              <PlusIcon /> Create Assignment
            </Button>
          }
        />
        <Link href="/dashboard/explore">
          <Button variant="surface">
            <MagnifyingGlassIcon /> Explore
          </Button>
        </Link>
        <Link href="/dashboard/assignments">
          <Button variant="surface">
            <FileTextIcon /> My Assignments
          </Button>
        </Link>
      </Flex>

      <Box my="8">
        <Text className="text-xl font-bold">Assignments</Text>

        <Flex gap="4" className="mt-4 flex-col lg:flex-row lg:items-start">
          <Card size="2" className="flex-1 h-fit self-start w-full">
            <Flex justify="between" align="center" mb="4">
              <Text size="4" className="font-bold">
                Assigned
              </Text>
            </Flex>
            <Suspense fallback={<AssignmentListSkeleton />}>
              <AssignmentAssignedList limit={5} />
            </Suspense>
            {assignedCount ? (
              <Button variant="outline" mt="3">
                <Link href="/dashboard/assignments">View all</Link>
              </Button>
            ) : null}
          </Card>

          <Card size="2" className="flex-1 h-fit self-start w-full">
            <Flex justify="between" align="center" mb="4">
              <Text size="4" className="font-bold">
                Authored
              </Text>
            </Flex>
            <Suspense fallback={<AssignmentListSkeleton />}>
              <AssignmentAuthoredList limit={5} />
            </Suspense>
            {authoredCount ? (
              <Button variant="outline" mt="3">
                <Link href="/dashboard/assignments?tab=authored">View all</Link>
              </Button>
            ) : null}
          </Card>
        </Flex>
      </Box>
    </div>
  );
}
