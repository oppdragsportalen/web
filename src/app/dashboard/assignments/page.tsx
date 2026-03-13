import { Suspense } from "react";
import { Box, Card, Tabs, Text } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AssignmentAuthoredList from "@/app/components/assignment-authored-list";
import AssignmentAssignedList from "@/app/components/assignment-assigned-list";
import { AssignmentCardSkeleton } from "@/app/components/assignment-card-skeleton";
import AssignmentSearch from "@/app/components/assignment-search";

function AssignmentListSkeleton() {
  return (
    <Box>
      <AssignmentCardSkeleton />
      <AssignmentCardSkeleton />
      <AssignmentCardSkeleton />
    </Box>
  );
}

export default async function AssignmentPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { tab, q } = await searchParams;
  const defaultTab = tab || "assigned";

  return (
    <div className="p-4 min-w-80">
      <Box className="mt-4 mb-10">
        <h1 className="text-3xl font-bold">My Assignments</h1>
      </Box>
      <Box>
        <Tabs.Root defaultValue={defaultTab}>
          <Tabs.List>
            <Tabs.Trigger value="assigned">Assigned</Tabs.Trigger>
            <Tabs.Trigger value="authored">Authored</Tabs.Trigger>
          </Tabs.List>

          <AssignmentSearch />

          <Box pt="3">
            <Tabs.Content value="assigned">
              <Suspense fallback={<AssignmentListSkeleton />}>
                <AssignmentAssignedList search={q} />
              </Suspense>
            </Tabs.Content>

            <Tabs.Content value="authored">
              <Suspense fallback={<AssignmentListSkeleton />}>
                <AssignmentAuthoredList search={q} />
              </Suspense>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
    </div>
  );
}
